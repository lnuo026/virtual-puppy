import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { PetModule } from "../pet/pet.module";

@Module({
     imports: [PetModule],
     controllers: [ChatController],
     providers: [ChatService],
})

export class ChatModule {}