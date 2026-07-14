import { hasUncaughtExceptionCaptureCallback } from "process";

export const BREEDS = ['shiba', 'corgi', 'poddle', 'husky', 'labrador', 'golden retriever', 'beagle', 'bulldog', 'dalmatian', 'rottweiler', 'german shepherd', 'pug', 'chihuahua', 'boxer', 'dachshund', 'siberian husky', 'border collie', 'australian shepherd', 'great dane', 'cocker spaniel']as const;
export const COATS = ['brown', 'white', 'black', 'spotted', 'golden'] as const; 
export const PERSONALITIES = ['friendly', 'playful', 'loyal', 'protective', 'intelligent', 'curious', 'affectionate', 'independent', 'energetic', 'gentle', 'clingy', 'playful'] as const;

export const STARTING_HEALTH = 100;

export const DECAT_PET_MINUTE = {
     hunger: 1,
     thirst: 1,
     health: 1,
     mood: 0.5,
     energy: 0.3,
     hygiene: 0.4,
};

export const HUNGER_THRESHOLD = 30;
export const TIRED_THRESHOLD = 25;
export const HAPPY_THRESHOLD = 45;
export const SICK_ENTER_THRESHOLD = 20;
export const SICK_EXIT_HEALTH_THRESHOLD = 50;
export const HEALTH_PENALTY_PER_MINUTE = 0.15;
export const HEALTH_RECOVERY_PER_MINUTE = 0.1;

export const FEED_AMOUNT = 30;
export const FEED_MOOD_BONUS = 5;
export const PLAY_MOOD_AMOUNT = 20;
export const PLAY_ENERGY_COST = 15;
export const BATH_AMOUNT = 100;
export const SLEEP_DURATION_MS = 20 * 60 * 1000; // 20 minutes in milliseconds

export const DAILY_CHECK_BONUS =10;
export const DAILY_TASK_BONUS = 10;

