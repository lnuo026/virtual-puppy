import { useState} from "react";
import { sendMessage, type ChatMessage } from "../api/chat";

export default function ChatPannel( {petName}: { petName: string} ){
     const [messages, setMessages] = useState<ChatMessage[]>([]);
     const [input, setInput] = useState('');
     const [sending, setSending] = useState(false);

     const handleSend = async () => {
          const text = input.trim();
          if(!text || sending) return;

          const nextMessages = [...messages, {role: 'user', content: text} as ChatMessage];
          setMessages(nextMessages);
          setInput('');
          setSending(true);

          try{
               const { reply} =  await sendMessage(nextMessages.slice(-20));
               setMessages( (prev) => [...prev, { role: 'assistant', content: reply}]);
          }finally{
               setSending(false);
          }
     }


          return (
               <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-gray-700">Chat with
                         {petName}
                    </h3>

                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                         {messages.map( (msg, index) => (
                              <div key={index} className={`text-sm px-3 py-2 rounded-lg  max-w-[80%] ${
                                   msg.role === 'user'
                                   ? 'self-end bg-amber-100 text-amber-900'
                                   : 'self-start bg-gray-100 text-gray-700'
                              }`}>
                                   {msg.content}
                              </div>
                         ))}
                         {sending  && <div className="text-xs text-gray-400 self-start"> {petName} is typing...</div>}
                    </div>

                    <div className="flex gap-2">
                         <input
                              value = {input}
                              onChange={ (e) => setInput(e.target.value)}
                              onKeyDown={ (e) =>e.key === 'Enter' && handleSend()}
                              placeholder="your can say something"
                              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                              />

                         <button
                              onClick={handleSend}
                              disabled={sending}
                              className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                              >
                               Send
                         </button>
                    </div>
               </div>
          );          
     }

