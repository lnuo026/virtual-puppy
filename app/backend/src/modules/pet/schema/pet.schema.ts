import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { BREEDS, COATS, PERSONALITIES, STARTING_HEALTH,STARTING_STAT } from "../lib/constants";

export type Breed = (typeof BREEDS)[number];
export type Coat = (typeof COATS)[number];
export type Personality = (typeof PERSONALITIES)[number];
export type PetStatus = 'idle' | 'sad' | 'angry'| 'hungry'| 'tired'| 'happy'| 'sick'| 'sleeping';

export type PetDocument = HydratedDocument<Pet>;

@Schema({timestamps: true})
export class Pet {
     @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index:true })
     userId!: Types.ObjectId;

     @Prop({ required: true})
     name!: string;

     
     @Prop({ required: true, enum: COATS })
     coat!: Coat;
     
     @Prop({ required: true, enum: PERSONALITIES })
     personality!: Personality;
     
     @Prop({ required: true, enum: BREEDS })
     breed!: Breed;
     
     @Prop({ default: STARTING_HEALTH, min: 0, max: 100 })
     health!: number;
     
     @Prop({ default: 'idle', enum: ['idle', 'sad', 'angry', 'hunger', 'tired', 'happy', 'sick', 'sleeping'] })
     status!: PetStatus;

     @Prop({ default: STARTING_STAT, min: 0, max: 100 })
     hunger!: number;

     @Prop({ default: STARTING_STAT, min: 0, max: 100 })
     thirst!: number;

     @Prop({ default: STARTING_STAT, min: 0, max: 100 })
     mood!: number;

     @Prop({ default: STARTING_STAT, min: 0, max: 100 })
     energy!: number;

     @Prop({ default: STARTING_STAT, min: 0, max: 100 })
     hygiene!: number;

     @Prop({ default: Date.now })
     lastInteractionAt!: Date;

     @Prop({ default: Date.now })
     lastVisitAt!: Date;

     @Prop({})
     sleepUntil?: Date;

     @Prop({ default: 0 })
     streakCount!: number;

     @Prop({})
     lastCheckInDate?: string;

     @Prop({ default: false })
     dailyFedToday!: boolean;

     @Prop({ default: false })
     dailyPlayedToday!: boolean;

     @Prop({ default: false })
     dailyTaskCompletedToday!: boolean;
}

export const PetSchema = SchemaFactory.createForClass(Pet)