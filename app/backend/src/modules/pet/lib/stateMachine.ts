import { Pet, PetStatus } from '../schemas/pet.schema';
import { HAPPY_THRESHOLD, HUNGRY_THRESHOLD, SICK_ENTER_HEALTH, SICK_EXIT_HEALTH, TIRED_THRESHOLD } from './constants';


export function deriveStatus(
     pet: Pick<Pet, 'hunger' | 'energy' | 'mood' |
                    'health' | 'status' | 'sleepUntil'>,
                    now:number,): PetStatus {
                         if (pet.health <= SICK_ENTER_HEALTH) return 'sick';
                         if (pet.status === 'sick' && pet.health < SICK_EXIT_HEALTH) return 'sick';
                         if(pet.sleepUntil &&  pet.sleepUntil.getTime() > now) return 'sleeping';
                         if(pet.hunger <= HUNGRY_THRESHOLD) return 'hungry';
                         if(pet.energy <= TIRED_THRESHOLD) return 'tired';
                         if(pet.mood >= HAPPY_THRESHOLD) return 'happy';
                         return 'idle'; 
                        }