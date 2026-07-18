import request from "./request";

export interface ChatMessage {
     role: 'user' | 'assistant' ;
     content: string;
}

export const sendMessage = (messages: ChatMessage[]) =>
     request.post< {reply: string}>('/chat' ,{messages});
