import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CylindersModule } from './cylinders/cylinders.module';
import { GasProfilesModule } from './gas-profiles/gas-profiles.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CylindersModule, AuthModule, GasProfilesModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
