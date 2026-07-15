import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PetService } from 'src/modules/pet/pet.service';
import { buildSystemPrompt } from './lib/buildSystemPrompt';
import { ChatRequestDto } from './dto/chat-request.dto';

interface GeminiResponse {
     candidates?: {
          content?: {
               parts?: { text?: string }[];
          };
     }[];
}

@Injectable()
export class ChatService {
     private readonly logger = new Logger(ChatService.name);

     constructor(
          private readonly petService: PetService,
          private readonly config: ConfigService,
     ){}

     async reply(userId: string, dto: ChatRequestDto): Promise< {reply: string}>{
          const pet = await this.petService.findByUser(userId);
          const apiKey = this.config.getOrThrow<string>('GEMINI_API_KEY');
          const model = this.config.get<string>('GEMINI_MODEL' )?? 'genmini-2.5-flash';

          const contents  =dto.messages.map((message) => ({
               role: message.role === 'assistant' ? 'model' : 'user',
               parts: [{ text: message.content }],
          }));

          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

          try {
               const res = await fetch(url, {
                    method: 'POST',    
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                         contents, 
                         systemInstruction: { parts:[{text: buildSystemPrompt(pet) }] },
               }),
          });

          if(!res.ok) {
               this.logger.error(`Gemini API error: ${res.status} ${await res.text()}`);

               return { reply: `${pet.name} tilts their head, distracted by something. Try again in a moment? `}
          }

          const body = (await res.json()) as GeminiResponse;
          const text = body.candidates?.[0]?.content?.parts?.[0]?.text;

          return { reply:text?.trim() || `${pet.name} wags their tail but does not quite know what to say`}

          } catch (error) {
               this.logger.error( `Gemini API call failed` ,error instanceof Error ? error.stack : error );
               return { reply: `${pet.name} seems to have wandered off. Try again in a moment.` }
          }
     }
}