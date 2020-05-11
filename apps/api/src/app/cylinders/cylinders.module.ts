import { Module } from '@nestjs/common';

import { CylindersService } from './cylinders.service';
import { CylindersController } from './cylinders.controller';

@Module({
  imports: [],
  controllers: [CylindersController],
  providers: [CylindersService]
})
export class CylindersModule {}
