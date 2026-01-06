import { Module } from '@nestjs/common';
import { CardAppearanceService } from './card-appearance.service';
import { CardAppearanceController } from './card-appearance.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CardAppearanceController],
  providers: [CardAppearanceService],
})
export class CardAppearanceModule {}
