import { useEffect, useState } from "react";
import { usePetStore } from "../store/petStore";
import { useUserStore } from "../store/userStore";
import { getPet, feedPet, playPet, sleepPet, bathPet } from "../api/pet";
import StatBar from "../components/StatBar";
import { logoutUrl } from "../api/auth";
import ChatPannel from "../components/ChatPannel";

const STATUS_LABEL: Record<string, string> = {
     idle: "Idle",
     sad: "Sad",
     angry: "Angry",
     hungry: "Hungry",
     tired: "Tired",
     happy: "Happy",
     sick: "Sick",
     sleeping: "Sleeping"
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

     useEffect(() => {
          getPet()
               .then(( {pet, justHatched, justCheckedIn} ) => {
                    setPet(pet);
                    setHatchSignal(justHatched, justCheckedIn);
               });
     },[setPet, setHatchSignal]);

     const handleLogout = () => {
          clearUser();
          window.location.href = logoutUrl;
     };


     if(!pet) {
          return (
               <div className="min-h-screen flex items-cneter justify-center text-gray-400">
                    Loading your puppy...
               </div>
          );
     }


     return(
          <div className="min-h-screen bg-amber-50">
               <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">Your Puppy</h1>
                    <div className="flex items-center gap-3">
                         {user?.picture  && <img src={user.picture} className="w-8 h-8 rounded-full" />}
                         <span className="text-sm text-gray-600">
                              {user?.name}
                         </span>
                         <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-pink-800 transition">
                              Logout
                         </button>
                    </div>
               </header>

               <main className="max-w-md mx-auto px-4 py-8 flex flex-col gap-4">
                    {justHatched && !dismissedHatch && (
                      <div className="bg-yellow-100 text-yellow-800 text-sm rounded-lg px-4 py-3 flex justify-between items-center">
                         A new baby hatched - say hi to {pet.name}!
                         <button onClick={ () => setDismissedHatch(true)}
                                 className="text-yellow-600 hover:text-yellow-900"   >
                                   🤓Dismiss X
                         </button>
                      </div>   
                    )}
                    {justCheckedIn && (
                         <div className="bg-blue-50 text-blue-700 text-sm rounded-lg px-4 py-2">
                              <h2 className="text-lg font-semibold bg-blue-100">Welcome back! {pet.name} missed you!</h2>
                              <h3 className="bg-blue-50 text-md">We were worried about you!</h3>
                              <h3 className="bg-blue-50 text-md"> Day {pet.streakCount} check-in streak!</h3>
                         </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
                         <div className="text-center"> 
                              <h2 className="text-lg font-semibold text-gray-800">
                                   {pet.name}
                              </h2>
                              <p className="text-xs text-gray-400 capitalize">
                                   {pet.breed} breed ✅ {pet.coat} coat ✅ {pet.personality} personality ✅
                              </p>
                              <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 capitalize">
                                   {STATUS_LABEL[pet.status] ?? pet.status}
                              </span>
                         </div>
                         
                         <div className="flex flex-col gap-3">
                              <StatBar label="Hunger" value={pet.hunger} color="bg-orange-400"/>
                              <StatBar label="Mood" value={pet.mood} color="bg-blue-400"/>
                              <StatBar label="Energy" value={pet.energy} color="bg-pink-400"/>
                              <StatBar label="Hygiene" value={pet.hygiene} color="bg-purple-400"/>
                              <StatBar label="Health" value={pet.health} color="bg-green-400"/>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                         <button 
                              onClick={ () => feedPet().then(setPet)}
                              className="bg-white shadow-sm rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 transition">
                              Feed
                         </button>

                         <button 
                              onClick={ () => playPet().then(setPet)}
                              className="bg-white shadow-sm rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 transition">
                              Play
                         </button>

                         <button 
                              onClick={ () => sleepPet().then(setPet)}
                              disabled= { pet.status === 'sleeping' }
                              className="bg-white shadow-sm rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-pink-50 transition disabled:opacity-40 disabled:cursor-not-allowed">
                              {pet.status === 'sleeping' ? 'Zzz...' : 'Sleep'}
                         </button>

                         <button 
                              onClick={ () => bathPet().then(setPet)}
                              className="bg-white shadow-sm rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 transition">
                              Bath
                         </button>
                    </div>

                    <ChatPannel petName={pet.name} />
               </main>
          </div>
     );
}