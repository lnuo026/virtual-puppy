import request from "./request";
import type {User} from "../store/userStore";

export const getMe = () => request.get<User>('/users/profile');

export const loginUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
export const logoutUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/logout`;