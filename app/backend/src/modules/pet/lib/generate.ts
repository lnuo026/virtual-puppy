import { PERSONALITIES } from "./constants";
import { Breed, Coat, Personality, ModeId } from "../schemas/pet.schema";


function pickRandom<T>(items: readonly T[]): T {
     return items[Math.floor(Math.random() * items.length)];     
}
const DEFAULT_NAMES = [ 'Marshmallow', 'Caramel', 'Cupcake', 'Brownie', 'Toffee','Macaron', 'Donut', 'Muffin', 'Pretzel', 'Taffy',]
interface PetProfile {
     breed: Breed;
     coat: Coat;
     modelId: ModeId;
}

const PET_PROFILES: PetProfile[] = [
     {
          breed: 'german_shepherd',
          coat: 'brown',
          modelId: 'german_shepherd'
     },
      {
          breed: "labrador",
          coat: "golden",
          modelId: "labrador",
    },
    {
          breed: "village_dog",
          coat: "golden",
          modelId: "village_dog",
    },
    {
          breed: "mastiff",
          coat: "black",
          modelId: "mastiff",
    },
     
]


export function generatePet ():{ 
     name: string; 
     breed: Breed; 
     coat: Coat; 
     personality: Personality;
     modelId: ModeId;
} {
     const profile = pickRandom(PET_PROFILES);

     return {
          name: pickRandom(DEFAULT_NAMES),
          breed: profile.breed,
          coat: profile.coat,
          personality: pickRandom(PERSONALITIES),
          modelId: profile.modelId,
     }
}