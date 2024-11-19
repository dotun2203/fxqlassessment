import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';

export class UpdateFxqlDto {
  @ApiPropertyOptional({
    description: 'Source currency code (3 uppercase letter)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{3}$/, {
    message: 'sourceCurrency must be 3 uppercase letters',
  })
  sourceCurrency?: string;

  @ApiPropertyOptional({
    description: 'Destination currency code (3 uppercase letters)',
    example: 'GBP',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{3}$/, {
    message: 'destinationCurrency must be 3 uppercase letters',
  })
  destinationCurrency?: string;

  @ApiPropertyOptional({
    description: 'Buy price as a decimal number',
    example: 0.85,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  buyPrice?: number;

  @ApiPropertyOptional({
    description: 'Sell price as a decimal number',
    example: 0.9,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sellPrice?: number;

  @ApiPropertyOptional({
    description: 'Cap amount as a positive integer',
    example: 10000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  capAmount?: number;
}
