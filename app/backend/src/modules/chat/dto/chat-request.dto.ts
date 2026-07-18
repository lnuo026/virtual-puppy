import { ArrayMaxSize, IsArray, IsIn, IsString, MaxLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class ChatMessageDto {
     @IsIn(['user','assistant'])
     role!: 'user' | 'assistant';

     @IsString()
     @MaxLength(1000)
     content!: string;
}

export class ChatRequestDto {
     @IsArray()
     @ArrayMaxSize(20)
     @ValidateNested({ each: true })
     @Type(() => ChatMessageDto)
     messages!: ChatMessageDto[];
}