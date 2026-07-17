import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./router/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { getMe } from "./api/auth";
import { useUserStore } from "./store/userStore";

export default function App() {
     const {setUser, setInitialized} = useUserStore();

     useEffect(() => {
          getMe()
               .then((response) => {
                    setUser(response.data);
               })
               .catch((error) => {
                    console.error("Error fetching user profile:", error);
               })
               .finally(() => {
                    setInitialized();
               })
          }, [setUser, setInitialized]);


     return (
          <BrowserRouter>
          <Routes>
               <Route path="/login" element={<LoginPage />} />
               <Route 
                    path="/" 
                    element={
                         <ProtectedRoute>
                            <HomePage />
                         </ProtectedRoute>
                    }
               />
          </Routes>
          </BrowserRouter>
     );          
}