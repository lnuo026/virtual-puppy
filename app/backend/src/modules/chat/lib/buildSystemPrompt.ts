import { PetDocument, Personality } from '../../pet/schemas/pet.schema';

interface RecentMessage {
  role: 'user' | 'assistant';
  content: string;
}

const PERSONALITIES_TONE: Record<Personality, string> = {
  friendly: 'warm and welcoming, easy to talk to',
  playful: 'energetic and upbeat, uses exclamation marks often',
  loyal: 'devoted, frequently reassures the user they are trusted',
  protective: "watchful, checks in on the user's wellbeing",
  intelligent: 'thoughtful, sometimes makes clever observations',
  curious: 'asks questions back, interested in details',
  affectionate: 'warm, expresses fondness openly',
  independent: "a bit aloof and confident, doesn't over-explain",
  energetic: 'high energy, short punchy sentences',
  gentle: 'soft-spoken, calm and reassuring',
  clingy: 'affectionate, brings up missing the user, wants attention',
};

function describeStat(label: string, value: number): string {
  if (value >= 75) return `${label} is great!`;
  if (value >= 40) return `${label} is okay.`;
  return `${label} is low.`;
}

export function buildSystemPrompt(
  pet: PetDocument,
  recentMessages: RecentMessage[] = [],
): string {
  const status = [
    describeStat('hunger', pet.hunger),
    describeStat('mood', pet.mood),
    describeStat('energy', pet.energy),
    describeStat('hygiene', pet.hygiene),
    describeStat('health', pet.health),
  ].join(', ');

  const recentConversation = recentMessages
    .slice(-6)
    .map(
      (message) =>
        `${message.role === 'user' ? 'User' : pet.name}: ${message.content.trim().slice(0, 240)}`,
    )
    .join('\n');

  // careMemory array + .filter(Boolean) + .join(' ') combines the messages into a single string
  // .filter(Boolean) 是把数组里所有"假值"(" ")过滤掉,当函数用传给 filter时，等价于对每个元素做Boolean(元素) 判断真假
  const careMemory = [
    pet.dailyFedToday ? 'You were fed today.' : 'You have not been fed today.',
    pet.dailyPlayedToday ? 'You played today.' : 'You have not played today.',
    pet.dailyTaskClaimedToday ? "Today's care task was completed." : '',
    pet.streakCount > 1
      ? `The user has checked in for ${pet.streakCount} consecutive days.`
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  // systemprompt(history) + true content
  return [
    `You are ${pet.name}, a ${pet.coat} ${pet.breed} dog with a ${pet.personality} personality.`,
    `Personality tone: ${PERSONALITIES_TONE[pet.personality]}.`,
    `Current status: ${pet.status}. Right now: ${status}.`,
    `Your recent life memory: ${careMemory}`,
    recentConversation
      ? `Recent conversation context (continue naturally and do not repeat it verbatim):\n${recentConversation}`
      : 'This is the beginning of the conversation for this visit.',
    'Reply in first person as the dog, in 1-3 short sentences. Let your current stats color your mood naturally. Never break character and never mention that you are an AI.',
  ].join(' \n');
}
