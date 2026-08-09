import { deriveStatus } from "./stateMachine";
import { PetStatus } from "../schemas/pet.schema";
import { describe } from "node:test";

// 手写死一个固定的数字当"现在",保证每次跑测试,"现在"都是同一个时刻
const NOW = 1_700_000_000;

// TypeScript built-in : Partial, "把 T里所有字段都变成可选的"
// {} 是函数参数的默认值——如果调用 basePet() 时完全不传参数,overrides就自动变成一个空对象 {},不会报错
function basePet(overrides: Partial<{
     hunger: number;
     energy: number;
     mood: number;
     status: PetStatus;
     sleepUntil?: Date;
}> = {}){
     return {
          hunger: 80,
          energy: 80,
          mood: 80,
          status: 'idle' as PetStatus,
          sleepUntil: undefined,
          ...overrides, 
     };
}

describe('deriveStatus', () => {
     // 同时满足sick/ sleeping条件,sick判断因为写在前面,优先级更高
     it("returns sick when health drops to the enter_threshold, or sleeping" , () => {
          const pet = basePet( {health: 20, sleepUntil: new Date(NOW + 6000)});

          expect(deriveStatus(pet, NOW)).toBe('sick');
     });

     it("stays sick until health clears the exit threshold,(hysteresis)", () => {
          const pet = basePet( {status: 'sick', health:40 });
          expect(deriveStatus(pet, NOW)).toBe('sick');
     });

     // export const SICK_EXIT_HEALTH = 50; export const HAPPY_THRESHOLD = 75;
     it("leaves sick status when health data reaches the exit threshold",() =>{
          const pet = basePet( {status: 'sick', health:50, mod: 80 });
          expect(deriveStatus(pet, NOW)).toBe('happy');  
     });

     it("returns sleeping when sleepUntil is in the future and pet is not sick", () => {
        const pet = basePet({ sleepUntil: new Date(NOW + 60_000) });
        expect(deriveStatus(pet, NOW)).toBe("sleeping");
      });

      it("returns hungry when hunger is at or below the threshold", () => {
        const pet = basePet({ hunger: 30 });
        expect(deriveStatus(pet, NOW)).toBe("hungry");
      });

      it("returns tired when energy is at or below the threshold", () => {
        const pet = basePet({ energy: 25 });
        expect(deriveStatus(pet, NOW)).toBe("tired");
      });

      it("returns happy when mood is at or above the threshold", () => {
        const pet = basePet({ mood: 75 });
        expect(deriveStatus(pet, NOW)).toBe("happy");
      });

      it("returns idle when nothing else applies", () =>{
          const pet = basePet({ mood:50});
          expect(deriveStatus(pet, NOW)).toBe('idle');
      });
})


/**
 * export const STARTING_HEALTH = 100;
 * export const SICK_ENTER_HEALTH = 20;
 * export const SICK_EXIT_HEALTH = 50;
 * export const HAPPY_THRESHOLD = 75;
 * 
 * export const HUNGRY_THRESHOLD = 30;
 * export const TIRED_THRESHOLD = 25;
 * {}
 */ 