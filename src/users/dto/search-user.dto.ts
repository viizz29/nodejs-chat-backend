import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SearchUserDto {
  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  q!: string;
}
