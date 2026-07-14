import { PetDocument } from "../schemas/pet.schema";
import { DECAY_PER_MINUTE, HEALTH_PENALTY_PER_MINUTE, HEALTH_RECOVERY_PER_MINUTE, HUNGRY_THRESHOLD, TIRED_THRESHOLD } from "./constants";
import { deriveStatus } from "./stateMachine";

function clamp(value: number): number {
     return Math.max(0, Math.min(100, value));
}

// 宠物状态随时间自然衰减的核心计算函数
export function applyDecay(pet: PetDocument, elapsedMs: number, now: number): void {
     // unit: milliseconds to minutes
     const elapsedMinutes = elapsedMs / 60000;
     // 如果没有时间流逝，就只更新一下状态显示，不做任何数值计算，然后提前返回"，避免在 elapsedMinutes 为 0 或负数时做无意义甚至出错的衰减运算
     if(elapsedMinutes <= 0) {
          pet.status = deriveStatus(pet, now);
          return;
     }

     if(pet.sleepUntil && pet.sleepUntil.getTime() <= now) {
          pet.energy = 100;
          pet.sleepUntil = undefined;
     }

     const isSleeping = pet.sleepUntil != undefined && pet.sleepUntil.getTime() > now;

     pet.hunger = clamp(pet.hunger - DECAY_PER_MINUTE.hunger * elapsedMinutes);
     pet.mood = clamp(pet.mood - DECAY_PER_MINUTE.mood * elapsedMinutes);
     pet.hygiene = clamp(pet.hygiene - DECAY_PER_MINUTE.hygiene * elapsedMinutes);
     if(!isSleeping) {
          pet.energy = clamp(pet.energy - DECAY_PER_MINUTE.energy * elapsedMinutes);
     }
     const inDanger = pet.hunger <= HUNGRY_THRESHOLD || pet.energy <= TIRED_THRESHOLD;
     pet.health = clamp(pet.health + (inDanger ? -HEALTH_PENALTY_PER_MINUTE : HEALTH_RECOVERY_PER_MINUTE) * elapsedMinutes
 );


     pet.status = deriveStatus(pet, now);


}
     