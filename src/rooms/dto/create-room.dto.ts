import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ type: String, description: 'HashId (encoded)', default: '' })
  @IsInt()
  @IsNotEmpty()
  secondMemberId!: number;
}
