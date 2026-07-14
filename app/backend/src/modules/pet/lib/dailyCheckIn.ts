import { PetDocument } from "../schemas/pet.schema";
import { DAILY_CHECKIN_BONUS } from "./constants";

function dateString(d: Date): string {
     return d.toISOString().slice(0, 10);
}

function yesterday(d: Date): Date {
     const copy = new Date(d);
     copy.setDate(copy.getDate() -1);
     return copy;
}

export function applyDailyCheckIn(pet: PetDocument, now: Date): boolean {
     const today = dateString(now);
     if(pet.lastCheckInDate === today) {
          return false;
     }

     pet.streakCount = pet.lastCheckInDate === dateString(yesterday(now)) ? 
     pet.streakCount + 1 : 1;
     pet.lastCheckInDate = today;
     pet.dailyFedToday = false;
     pet.dailyPlayedToday = false;
     pet.dailyTaskClaimedToday = false;
     pet.mood = Math.min(100, pet.mood + DAILY_CHECKIN_BONUS);
     pet.hunger = Math.min(100, pet.hunger + DAILY_CHECKIN_BONUS);


     return true;
     
}