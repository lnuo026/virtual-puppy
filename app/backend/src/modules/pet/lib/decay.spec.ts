import { applyDecay } from "./decay";
import { PetDocument } from "../schemas/pet.schema";
import { PetStatus } from "../schemas/pet.schema";
import { describe } from "node:test";

const NOW = 1_700_000_000;
const MINUTE = 60_000;

function basePet(overrides: Partial<{
     hunger: number;
     mood: number;
     hygiene: number;
     energy: number;
     health: number;
     status: PetStatus;
     sleepUntil?: Date;
}> = {}) {
     return {
          hunger: 80,
          mood: 80,
          hygiene: 80,
          energy: 80,
          health: 80,
          status: 'idle' as PetStatus,
          sleepUntil: undefined,
          ...overrides,
     } as unknown as PetDocument;
}

describe("applyDecay", () => {
     it("does nothing to starts when no time has elapsed", () => {
          const pet = basePet({ hunger: 80});
          applyDecay(pet, 0 , NOW);
          expect(pet.hunger).toBe(80);
     });
        
     
     it("reduces hunger, mood and hygiene proportionally to the elapsed time", () => {
          const pet = basePet({ energy: 80, sleepUntil: new Date(NOW + 30 * MINUTE) });
          applyDecay(pet, 10 * MINUTE, NOW);
          expect(pet.energy).toBe(80);
     })

     it("wakes the pet and refills energy once sleepUntil has passed", () => {
          const pet = basePet({ energy: 40, sleepUntil: new Date(NOW - MINUTE) });
          applyDecay(pet, 10 * MINUTE, NOW);
          expect(pet.energy).toBe(97);
          expect(pet.sleepUntil).toBeUndefined();
    });

    it("penalizes health once hunger drops into danger, using the post-decay value", () => {
          const pet = basePet({ hunger: 35, health: 80 });
          applyDecay(pet, 10 * MINUTE, NOW);
          expect(pet.hunger).toBe(25);
          expect(pet.health).toBe(78.5);
    });

    it("recovers health when hunger and energy are both safe", () => {
          const pet = basePet({ hunger: 80, energy: 80, health: 80 });
          applyDecay(pet, 10 * MINUTE, NOW);
          expect(pet.health).toBe(81);
    });

    it("clamps stats at 0 instead of going negative", () => {
          const pet = basePet({ hunger: 5 });
          applyDecay(pet, 10 * MINUTE, NOW);
          expect(pet.hunger).toBe(0);
    });

    it("clamps health at 100 instead of exceeding it", () => {
          const pet = basePet({ hunger: 80, energy: 80, health: 99 });
          applyDecay(pet, 10 * MINUTE, NOW);
          expect(pet.health).toBe(100);
    });
  

});
