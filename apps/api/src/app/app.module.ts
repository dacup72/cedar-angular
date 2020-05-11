import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CylindersModule } from './cylinders/cylinders.module';

@Module({
  imports: [CylindersModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
