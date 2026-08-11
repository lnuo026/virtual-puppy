import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { UserDocument } from '../user/schemas/user.schema';
import { Throttle } from '@nestjs/throttler';

@Controller('chat')
export class ChatController {
     constructor(private readonly chatService: ChatService) {}

     @Throttle({ default: { limit: 5, ttl: 60_000 } }) 
     @Post()
     reply(@CurrentUser()user: UserDocument, @Body() dto: ChatRequestDto) {
          return this.chatService.reply(user._id.toString(), dto);
     }
}