import { BREEDS, COATS, PERSONALITIES } from "./constants";
import { Breed, Coat, Personality } from "../schemas/pet.schema";

function pickRandom<T>(items: readonly T[]): T {
     return items[Math.floor(Math.random() * items.length)];     
}

const DEFAULT_NAMES = [ 'Marshmallow', 'Caramel', 'Cupcake', 'Brownie', 'Toffee','Macaron', 'Donut', 'Muffin', 'Pretzel', 'Taffy',]

export function generatePet ():{ name: string; breed: Breed; coat: Coat; personality: Personality } {
     return {
          name: pickRandom(DEFAULT_NAMES),
          breed: pickRandom(BREEDS),
          coat: pickRandom(COATS),
          personality: pickRandom(PERSONALITIES),
     }
}