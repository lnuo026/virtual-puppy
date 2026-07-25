import { useState } from "react";
import type { Breed } from "../api/pet";

const FALLBACK_IMAGE = "/shiba.png";

interface PetAvatarProps {
     breed: Breed;
}

export default function PetAvatar({ breed }: PetAvatarProps) {
     const [imgSrc, setImgSrc] = useState(`/${breed}.png`);

     return (
          <img
               src={imgSrc}
               onError={() => setImgSrc(FALLBACK_IMAGE)}
               alt={breed}
               className="w-32 h-32 mx-auto object-contain"
          />
     );
}
