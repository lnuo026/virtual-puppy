import { applyDailyCheckIn } from "./dailyCheckIn";
import { PetDocument } from "../schemas/pet.schema";

const NOW = new Date("2026-08-10T12:00:00.000Z");
const TODAY = "2026-08-10";
const YESTERDAY = "2026-08-09";
const TWO_DAYS_AGO = "2026-08-08";

function basePet(overrides: Partial<{

     lastCheckInDate: string;
     streakCount: number;
     mood: number;
     hunger: number;
     dailyFedToday: boolean;
     dailyPlayedToday: boolean;
     dailyTaskClaimedToday: boolean;
}> = {}) {

return {

     lastCheckInDate: undefined,
     streakCount: 0,
     mood: 80,
     hunger: 80,
     dailyFedToday: true,
     dailyPlayedToday: true,
     dailyTaskClaimedToday: true,
     ...overrides,
} as unknown as PetDocument;
}

describe("applyDailyCheckIn", () => {
     it("returns false and changes nothing when already checked in today", ()=> {
          const pet = basePet({ lastCheckInDate: TODAY, streakCount: 5 });
          const result = applyDailyCheckIn(pet, NOW);
          expect(result).toBe(false);
          expect(pet.streakCount).toBe(5);
});

     it("starts the streak at 1 on a first-ever check-in", () => {
          const pet = basePet({ lastCheckInDate: undefined });
          const result = applyDailyCheckIn(pet, NOW);
          expect(result).toBe(true);
          expect(pet.streakCount).toBe(1);
          expect(pet.lastCheckInDate).toBe(TODAY);
});

     it("increments the streak when the last check-in was yesterday", () => {
          const pet = basePet({ lastCheckInDate: YESTERDAY, streakCount: 4 });
          applyDailyCheckIn(pet, NOW);
          expect(pet.streakCount).toBe(5);
});

     it("resets the streak to 1 when a day was missed", () => {
          const pet = basePet({ lastCheckInDate: TWO_DAYS_AGO, streakCount: 4 });
          applyDailyCheckIn(pet, NOW);
          expect(pet.streakCount).toBe(1);
});

     it("resets today's care flags and applies the mood/hunger bonus, clamped at 100", () => {
          const pet = basePet({
          lastCheckInDate: YESTERDAY,
          mood: 95,
          hunger: 95,
          dailyFedToday: true,
          dailyPlayedToday: true,
          dailyTaskClaimedToday: true,
     });
     
          applyDailyCheckIn(pet, NOW);
          expect(pet.dailyFedToday).toBe(false);
          expect(pet.dailyPlayedToday).toBe(false);
          expect(pet.dailyTaskClaimedToday).toBe(false);
          expect(pet.mood).toBe(100);
          expect(pet.hunger).toBe(100);
});
});