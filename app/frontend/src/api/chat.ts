import request from "./request";

export interface ChatMessage {
     role: 'user' | 'assistant' ;
     content: string;
}

export const sendMessage = (message: ChatMessage[]) =>
     request.post< {reply: string}>('/chat' ,{message});
