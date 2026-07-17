import request from "./request";

export type Breed = 'shiba' | 'corgi' | 'poodle' | 'husky' | 'labrador' | 'golden retriever' | 'beagle' | 'bulldog' | 'dalmatian' | 'rottweiler' | 'german shepherd' | 'pug' | 'chihuahua' | 'boxer' | 'dachshund' | 'siberian husky' | 'border collie' | 'australian shepherd' | 'great dane' | 'cocker spaniel';
export type Coat = 'brown' | 'white' | 'black' | 'spotted' | 'golden'; 
export type Personality = 'friendly' | 'loyal' | 'protective' | 'intelligent' | 'curious' | 'affectionate' | 'independent' | 'energetic' | 'gentle' | 'clingy' | 'playful';
export type PetStatus = 'idle' | 'sad' | 'angry' | 'hungry' | 'tired' | 'happy' | 'sick' | 'sleeping'


export interface Pet {
     _id: string;
     name: string;
     breed: Breed;
     coat: Coat;
     personality: Personality;
     health: number;
     state: PetStatus;
     hunger: number;
     mood: number;
     energy: number;
     hygiene: number;
     sleepUntil?: string;
     streakCount: number;
     dailyFedToday: boolean;
     dailyPlayedToday: boolean;
     dailyTaskClaimedToday: boolean;
}


export interface PetResponse {
     pet: Pet;
     justHatched: boolean;
     justCheckedIn: boolean;
}

export const getPet = () => request.get<PetResponse>('/pet');
export const feedPet = () => request.post<Pet>('/pet/feed');
export const playPet = () => request.post<Pet>('/pet/play');
export const sleepPet = () => request.post<Pet>('/pet/sleep');
export const bathPet = () => request.post<Pet>('/pet/bath');
export const renamePet = (name: string) => request.patch<Pet>('/pet/rename', { name });
