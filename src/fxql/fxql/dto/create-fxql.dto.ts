import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFxqlDto {
  @ApiProperty({
    description: 'FXQL statements as a string',
    example: 'USD-GBP {\\n BUY 100\\n SELL 200\\n CAP 93800\\n}',
  })
  @IsString()
  @IsNotEmpty()
  FXQL: string;
}
