import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDocument } from '../user/schemas/user.schema';

@Controller('chat')
export class ChatController {
     constructor(private readonly chatService: ChatService) {}

     @Post()
     reply(@CurrentUser()user: UserDocument, @Body() dto: ChatRequestDto) {
          return this.chatService.reply(user._id.toString(), dto);
     }
}