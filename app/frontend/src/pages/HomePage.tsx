import { useEffect, useMemo, useRef, useState } from "react";
import { logoutUrl } from "../api/auth";
import {
  bathPet,
  feedPet,
  getPet,
  playPet,
  renamePet,
  sleepPet,
  type Pet,
} from "../api/pet";
import ChatPanel from "../components/ChatPanel";
import HatchCeremony from "../components/HatchCeremony";
import Icon, { type IconName } from "../components/Icon";
import PetScene, { type SceneEffect } from "../components/PetScene";
import StatBar from "../components/StatBar";
import { usePetStore } from "../store/petStore";
import { useUserStore } from "../store/userStore";

const STATUS_LABEL: Record<string, string> = {
  idle: "Relaxed",
  sad: "A little sad",
  angry: "Needs space",
  hungry: "Feeling hungry",
  tired: "Ready for a nap",
  happy: "Happy",
  sick: "Needs care",
  sleeping: "Sleeping",
};

type ActionName = "feed" | "play" | "sleep" | "bath";

const ACTIONS: Array<{
  name: ActionName;
  label: string;
  icon: IconName;
  accent: string;
}> = [
  { name: "feed", label: "Feed", icon: "bowl", accent: "#b9573a" },
  { name: "play", label: "Play", icon: "play", accent: "#64815f" },
  { name: "sleep", label: "Sleep", icon: "moon", accent: "#55758c" },
  { name: "bath", label: "Bath", icon: "bath", accent: "#4f8680" },
];

const ACTION_REQUESTS: Record<ActionName, () => Promise<Pet>> = {
  feed: feedPet,
  play: playPet,
  sleep: sleepPet,
  bath: bathPet,
};

export default function HomePage() {
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const pet = usePetStore((state) => state.pet);
  const setPet = usePetStore((state) => state.setPet);
  const justHatched = usePetStore((state) => state.justHatched);
  const justCheckedIn = usePetStore((state) => state.justCheckedIn);
  const setHatchSignal = usePetStore((state) => state.setHatchSignal);

  const [dismissedHatch, setDismissedHatch] = useState(false);
  const [showHatchCeremony, setShowHatchCeremony] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeAction, setActiveAction] = useState<ActionName | null>(null);
  const [feedback, setFeedback] = useState("");
  const [sceneEffect, setSceneEffect] = useState<SceneEffect>(null);
  const [sceneMessage, setSceneMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const feedbackTimer = useRef<number | undefined>(undefined);

  const loadPet = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await getPet();
      setPet(response.pet);
      setHatchSignal(response.justHatched, response.justCheckedIn);
      if (response.justHatched) setShowHatchCeremony(true);
    } catch {
      setLoadError("We couldn't bring your puppy home. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPet()
      .then((response) => {
        setPet(response.pet);
        setHatchSignal(response.justHatched, response.justCheckedIn);
        if (response.justHatched) setShowHatchCeremony(true);
      })
      .catch(() => {
        setLoadError("We couldn't bring your puppy home. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setHatchSignal, setPet]);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => () => window.clearTimeout(feedbackTimer.current), []);

  const showSceneFeedback = (effect: NonNullable<SceneEffect>, message: string) => {
    window.clearTimeout(feedbackTimer.current);
    setSceneEffect(effect);
    setSceneMessage(message);
    feedbackTimer.current = window.setTimeout(() => setSceneEffect(null), 2200);
  };

  const isSleeping = Boolean(
    pet?.sleepUntil && new Date(pet.sleepUntil).getTime() > currentTime,
  );

  const lowestStat = useMemo(() => {
    if (!pet) return "";
    const values = {
      Hunger: pet.hunger,
      Mood: pet.mood,
      Energy: pet.energy,
      Hygiene: pet.hygiene,
      Health: pet.health,
    };
    return Object.entries(values).sort((a, b) => a[1] - b[1])[0][0];
  }, [pet]);

  const handleRenameSubmit = async () => {
    setIsEditingName(false);
    const trimmedName = nameDraft.trim();
    if (!trimmedName || trimmedName === pet?.name) return;
    try {
      setPet(await renamePet(trimmedName));
      setFeedback(`Meet ${trimmedName}.`);
    } catch {
      setFeedback("That name didn't save. Please try again.");
    }
  };

  const handleAction = async (action: ActionName) => {
    if (activeAction || (action === "sleep" && isSleeping)) return;
    setActiveAction(action);
    setFeedback("");
    try {
      const nextPet = await ACTION_REQUESTS[action]();
      setPet(nextPet);
      const messages: Record<ActionName, string> = {
        feed: `${nextPet.name} enjoyed the meal.`,
        play: `${nextPet.name} is feeling more playful.`,
        sleep: `${nextPet.name} is settling down for a nap.`,
        bath: `${nextPet.name} is fresh and clean.`,
      };
      setFeedback(messages[action]);
      showSceneFeedback(action, messages[action]);

      const completelyCaredFor = [nextPet.hunger, nextPet.mood, nextPet.energy, nextPet.hygiene, nextPet.health]
        .every((value) => value >= 80);
      const celebrationKey = `virtual-puppy:care-celebration:${nextPet._id}:${new Date().toDateString()}`;
      if (completelyCaredFor && !window.sessionStorage.getItem(celebrationKey)) {
        window.sessionStorage.setItem(celebrationKey, "shown");
        window.setTimeout(() => {
          const celebration = `${nextPet.name} feels completely cared for today.`;
          setFeedback(celebration);
          showSceneFeedback("celebrate", celebration);
        }, 2300);
      }
    } catch {
      setFeedback("Something went wrong. Give it another try.");
    } finally {
      setActiveAction(null);
    }
  };

  const handleLogout = () => {
    clearUser();
    window.location.href = logoutUrl;
  };

  const handlePetClick = () => {
    if (!pet || activeAction || isSleeping) return;
    const message = `${pet.name} likes the attention.`;
    setFeedback(message);
    showSceneFeedback("pet", message);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4ee] text-stone-500">
        <div className="flex flex-col items-center gap-4">
          <div className="grid size-12 animate-pulse place-items-center rounded-full border border-[#b9573a]/30 bg-white text-[#b9573a]">
            <Icon name="paw" className="size-6" />
          </div>
          <p className="text-sm">Bringing your puppy home...</p>
        </div>
      </div>
    );
  }

  if (loadError || !pet) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4ee] px-6">
        <div className="max-w-sm text-center">
          <Icon name="paw" className="mx-auto mb-5 size-9 text-[#b9573a]" />
          <h1 className="text-xl font-semibold text-stone-800">Your puppy is taking a little longer</h1>
          <p className="mt-2 text-sm leading-6 text-stone-500">{loadError}</p>
          <button onClick={() => void loadPet()} className="mt-6 rounded-lg bg-[#a94f35] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#8f422c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a94f35]">
            Try again
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Hunger", value: pet.hunger, icon: "bowl" as const, color: "#c36a35" },
    { label: "Mood", value: pet.mood, icon: "smile" as const, color: "#688b62" },
    { label: "Energy", value: pet.energy, icon: "bolt" as const, color: "#587ca2" },
    { label: "Hygiene", value: pet.hygiene, icon: "sparkles" as const, color: "#4d8d87" },
    { label: "Health", value: pet.health, icon: "heart" as const, color: "#9a675b" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      {showHatchCeremony && (
        <HatchCeremony pet={pet} onContinue={() => setShowHatchCeremony(false)} />
      )}
      <header className="border-b border-stone-300/70 bg-[#faf8f3]/90 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1480px] items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3 text-stone-800">
            <Icon name="paw" className="size-8 text-[#b9573a]" />
            <span className="text-lg font-semibold tracking-[-0.02em] sm:text-xl">Virtual Puppy</span>
          </div>
          <div className="flex items-center gap-3">
            {user?.picture ? (
              <img src={user.picture} alt="" className="size-9 rounded-full border border-stone-300 object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="grid size-9 place-items-center rounded-full border border-stone-300 bg-white text-sm font-medium text-stone-600">
                {user?.name?.charAt(0) ?? "A"}
              </div>
            )}
            <span className="hidden text-sm text-stone-700 sm:block">{user?.name}</span>
            <button onClick={handleLogout} aria-label="Log out" className="grid size-9 place-items-center rounded-lg text-stone-500 transition hover:bg-stone-200/60 hover:text-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a94f35]">
              <Icon name="logout" className="size-4.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1480px] p-4 sm:p-6 lg:p-8">
        {(justHatched && !dismissedHatch) || justCheckedIn ? (
          <div className="mb-4 flex items-start justify-between gap-4 rounded-xl border border-[#b9573a]/20 bg-[#fffaf4] px-4 py-3 text-sm text-stone-700">
            <div className="flex gap-3">
              <Icon name="sparkles" className="mt-0.5 size-4.5 shrink-0 text-[#b9573a]" />
              <p>
                {justHatched
                  ? `A new puppy just arrived. Say hello to ${pet.name}.`
                  : `Welcome back. ${pet.name} missed you — day ${pet.streakCount} of your check-in streak.`}
              </p>
            </div>
            {justHatched && (
              <button onClick={() => setDismissedHatch(true)} className="shrink-0 text-xs font-medium text-stone-500 underline-offset-4 hover:text-stone-800 hover:underline">
                Dismiss
              </button>
            )}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.9fr)_minmax(330px,0.9fr)] lg:gap-5">
          <section className="overflow-hidden rounded-2xl border border-stone-300/80 bg-[#eee8dd]">
            <div className="relative">
              <div className="absolute left-5 top-5 z-10 sm:left-8 sm:top-7">
                {isEditingName ? (
                  <input
                    value={nameDraft}
                    onChange={(event) => setNameDraft(event.target.value)}
                    onBlur={() => void handleRenameSubmit()}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") void handleRenameSubmit();
                      if (event.key === "Escape") setIsEditingName(false);
                    }}
                    autoFocus
                    maxLength={24}
                    aria-label="Puppy name"
                    className="w-52 border-b border-stone-500 bg-transparent text-3xl font-semibold tracking-[-0.04em] text-stone-800 outline-none sm:text-5xl"
                  />
                ) : (
                  <button
                    onClick={() => { setIsEditingName(true); setNameDraft(pet.name); }}
                    className="block text-left text-3xl font-semibold tracking-[-0.04em] text-stone-800 transition hover:text-[#9c472f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a94f35] sm:text-5xl"
                    title="Rename your puppy"
                  >
                    {pet.name}
                  </button>
                )}
                <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-[#64815f]/40 bg-[#edf3ea]/85 px-2.5 py-1 text-sm font-medium text-[#456740] backdrop-blur-sm">
                  <span className="size-1.5 rounded-full bg-[#56814f]" />
                  {isSleeping ? "Sleeping" : (STATUS_LABEL[pet.status] ?? pet.status)}
                </div>
              </div>
              <PetScene
                effect={sceneEffect}
                isSleeping={isSleeping}
                message={sceneMessage}
                onPetClick={handlePetClick}
                status={pet.status}
              />
            </div>

            <div className="grid grid-cols-2 border-t border-stone-300/80 bg-[#faf8f3] sm:grid-cols-4">
              {ACTIONS.map((action, index) => {
                const disabled = Boolean(activeAction) || (action.name === "sleep" && isSleeping);
                const working = activeAction === action.name;
                return (
                  <button
                    key={action.name}
                    onClick={() => void handleAction(action.name)}
                    disabled={disabled}
                    className={`group flex min-h-20 items-center justify-center gap-3 border-stone-300/80 px-4 text-sm font-medium text-stone-700 transition hover:bg-white disabled:opacity-45 ${index % 2 ? "" : "border-r"} ${index >= 2 ? "border-t sm:border-t-0" : ""} ${index > 0 ? "sm:border-l" : ""}`}
                  >
                    <Icon name={action.icon} className="size-6 transition-transform group-hover:-translate-y-0.5" style={{ color: action.accent }} />
                    <span>{working ? "Working..." : action.name === "sleep" && isSleeping ? "Sleeping" : action.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="grid min-h-0 gap-4 lg:grid-rows-[auto_minmax(360px,1fr)]">
            <section className="rounded-2xl border border-stone-300/80 bg-[#fbfaf7] p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-400">Today's care</p>
                  <h2 className="mt-1 text-lg font-semibold text-stone-800">How {pet.name} is doing</h2>
                </div>
                <span className="rounded-md bg-stone-100 px-2 py-1 text-xs text-stone-500">Day {pet.streakCount}</span>
              </div>
              <div className="divide-y divide-stone-200">
                {stats.map((stat) => <StatBar key={stat.label} {...stat} isLowest={stat.label === lowestStat} />)}
              </div>
              {feedback && <p role="status" className="mt-3 border-t border-stone-200 pt-3 text-xs text-stone-500">{feedback}</p>}
            </section>

            <ChatPanel petName={pet.name} />
          </aside>
        </div>

        <p className="mt-4 text-center text-xs text-stone-400">
          {pet.breed} · {pet.coat} coat · {pet.personality}
        </p>
      </main>
    </div>
  );
}
