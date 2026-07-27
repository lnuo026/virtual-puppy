import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import Icon from "../components/Icon";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
     const user = useUserStore((state)=>state.user );
     const initialized = useUserStore((state)=>state.initialized);

     if(!initialized){
          return (
               <div className="flex min-h-screen items-center justify-center bg-[#f7f4ee]">
                    <Icon name="paw" className="size-8 animate-pulse text-[#b9573a]" />
               </div>
          );
     }

     if(!user){
          return <Navigate to="/login" replace />;
     }

     return <>{children}</>;
}
