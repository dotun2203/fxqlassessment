import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FxqlEntry } from './entities/fxql-entry.entity';
import { FxqlService } from './fxql/fxql.service';
import { FxqlController } from './fxql/fxql.controller';
import { FxqlParserService } from './fxql-parser.service';
import { RateLimiterGuard, RateLimiterModule } from 'nestjs-rate-limiter';

@Module({
  imports: [TypeOrmModule.forFeature([FxqlEntry]), RateLimiterModule],
  controllers: [FxqlController],
  providers: [FxqlService, FxqlParserService, RateLimiterGuard],
})
export class FxqlModule {}
