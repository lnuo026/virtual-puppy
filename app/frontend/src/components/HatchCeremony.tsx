import type { Pet } from "../api/pet";
import Icon from "./Icon";

export default function HatchCeremony({
  pet,
  onContinue,
}: {
  pet: Pet;
  onContinue: () => void;
}) {
  return (
    <div className="hatch-backdrop" role="dialog" aria-modal="true" aria-labelledby="hatch-title">
      <div className="hatch-card">
        <div className="hatch-mark" aria-hidden="true">
          <Icon name="paw" className="size-9" />
        </div>
        <p className="hatch-kicker">A new companion has arrived</p>
        <h1 id="hatch-title">Meet {pet.name}</h1>
        <p className="hatch-copy">
          Your {pet.breed} is {pet.personality} and ready to get to know you.
        </p>
        <div className="hatch-details">
          <span>{pet.breed}</span>
          <span>{pet.coat} coat</span>
          <span>{pet.personality}</span>
        </div>
        <button
          onClick={onContinue}
          className="hatch-button focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9573a]"
        >
          Meet {pet.name}
          <Icon name="chevron" className="size-4" />
        </button>
      </div>
    </div>
  );
}
