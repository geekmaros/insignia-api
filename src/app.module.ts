import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { CardsModule } from './cards/cards.module';
import { AuthModule } from './auth/auth.module';
import { CardLinksModule } from './card-links/card-links.module';
import { CardAppearanceModule } from './card-appearance/card-appearance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),
    UsersModule,
    DatabaseModule,
    CardsModule,
    AuthModule,
    CardLinksModule,
    CardAppearanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
