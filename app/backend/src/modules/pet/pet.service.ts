import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Pet, PetDocument } from "./schemas/pet.schema";
import { generatePet } from "./lib/generate";
import { applyDecay } from "./lib/decay";
import { deriveStatus } from "./lib/stateMachine";
import { applyDailyCheckIn } from "./lib/dailyCheckIn";
import { BATH_AMOUNT, DAILY_TASK_BONUS, FEED_AMOUNT, FEED_MOOD_BONUS, PLAY_ENERGY_COST, PLAY_MOOD_AMOUNT, SLEEP_DURATION_MS } from "./lib/constants";

function clamp(value: number): number {
     return Math.max(0, Math.min(100, value));
}

@Injectable()
export class PetService {
     constructor(@InjectModel(Pet.name) private readonly petModel: Model<PetDocument>){}

     async getOrCreatePet(userId: string,): Promise<{ pet: PetDocument;  justHatched: boolean; justCheckedIn: boolean; }> {
          const now = new Date();
          let pet =await this.petModel.findOne({
               userId: new Types.ObjectId(userId)
           }).exec();

           if(!pet) {
               const generated = generatePet();
               pet = await this.petModel.create({
                    userId: new Types.ObjectId(userId),
                    ...generated,
                    lastVisitAt: now,
                    lastInteractionAt: now,
               });
               const justCheckedIn = applyDailyCheckIn(pet,now);
               await pet.save();
               return { pet, justHatched: true, justCheckedIn };
           }

           const elapsedMs = now.getTime() - pet.lastVisitAt.getTime();
               applyDecay(pet, elapsedMs, now.getTime());
               const justCheckedIn = applyDailyCheckIn(pet, now);
               pet.lastVisitAt = now;
               await pet.save();

               return { pet, justHatched: false, justCheckedIn };
}
          async findByUser(userId: string):Promise<PetDocument> {
               return this.petOrThrow(userId);
          }

          private async petOrThrow(userId: string): Promise<PetDocument> {
               const pet = await this.petModel.findOne({
                     userId: new Types.ObjectId(userId)
               }).exec();

               if(!pet) {
                    throw new NotFoundException('Pet not found, please create one first');
               }
               return pet;
          }

          private syncPet(pet: PetDocument, now: Date): void {
               const elapsedMs = now.getTime() - pet.lastVisitAt.getTime();
               applyDecay(pet, elapsedMs, now.getTime());
               pet.lastVisitAt = now;
          }

          private maybeAwardDailyTask(pet: PetDocument): void {
               if(pet.dailyFedToday && pet.dailyPlayedToday && !pet.dailyTaskClaimedToday) {
                    pet.dailyTaskClaimedToday = true;
                    pet.mood = clamp(pet.mood + DAILY_TASK_BONUS);
               }
          }

          async feed(userId: string): Promise<PetDocument> {
               const now = new Date();
               const pet = await this.petOrThrow(userId);
               this.syncPet(pet, now);
               pet.hunger = clamp(pet.hunger + FEED_AMOUNT);
               pet.mood = clamp(pet.mood + FEED_MOOD_BONUS);
               pet.lastInteractionAt = now;
               pet.dailyFedToday = true;
               this.maybeAwardDailyTask(pet);
               pet.status = deriveStatus(pet, now.getTime());
               return pet.save();
          }

          async play(userId: string): Promise<PetDocument> {
               const now = new Date();
               const pet = await this.petOrThrow(userId);
               this.syncPet(pet, now);
               pet.energy = clamp(pet.energy - PLAY_ENERGY_COST);
               pet.mood = clamp(pet.mood + PLAY_MOOD_AMOUNT);
               pet.lastInteractionAt = now;
               pet.dailyPlayedToday = true;
               this.maybeAwardDailyTask(pet);
               pet.status = deriveStatus(pet, now.getTime());
               return pet.save();
          }

          async sleep(userId: string): Promise<PetDocument> {
               const now = new Date();
               const pet = await this.petOrThrow(userId);
               this.syncPet(pet, now);
               pet.sleepUntil = new Date(now.getTime() + SLEEP_DURATION_MS);
               pet.lastInteractionAt = now;
               pet.status = deriveStatus(pet, now.getTime());
               return pet.save();
          }

          async bath(userId: string): Promise<PetDocument> {
               const now = new Date();
               const pet = await this.petOrThrow(userId);
               this.syncPet(pet, now);
               pet.hygiene = BATH_AMOUNT;
               pet.lastInteractionAt = now;
               pet.status = deriveStatus(pet, now.getTime());
               return pet.save();
          }

          async rename(userId: string, newName: string): Promise<PetDocument> {
               const pet = await this.petOrThrow(userId);
               pet.name = newName;
               return pet.save();
          }
     }
               

