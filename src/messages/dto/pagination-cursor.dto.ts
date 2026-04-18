import { IsOptional, IsInt, Min, Max, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import Hashids from 'hashids';
import { HASHID_SALT } from 'src/config';
import { ApiProperty } from '@nestjs/swagger';

const hashids = new Hashids(HASHID_SALT, 10);

export class PaginationCursorDto {
  @ApiProperty({
    type: String,
    description: 'HashId (encoded)',
    default: '',
  })
  // @Transform(({ value }) => {
  //   console.log('Incoming:', value);

  //   const decoded = hashids.decode(value);

  //   console.log('Decoded:', decoded);

  //   return decoded.length ? decoded : undefined;
  // })
  // @IsArray()
  // @IsInt({ each: true })
  // roomId: number[] = [];
  @IsInt()
  roomId: number = 0;

  @ApiProperty({
    type: String,
    description: 'HashId (encoded)',
    default: '',
  })
  @IsOptional()
  @IsInt()
  cursorId: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
