import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CylindersModule } from './cylinders/cylinders.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CylindersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
