import { Module } from '@nestjs/common';
import { CardLinksService } from './card-links.service';
import { CardLinksController } from './card-links.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CardLinksController],
  providers: [CardLinksService],
})
export class CardLinksModule {}
