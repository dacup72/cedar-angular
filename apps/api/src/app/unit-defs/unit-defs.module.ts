import { Module } from '@nestjs/common';

import { UnitDefsService } from './unit-defs.service';
import { UnitDefsController } from './unit-defs.controller';

@Module({
  imports: [],
  controllers: [UnitDefsController],
  providers: [UnitDefsService]
})
export class UnitDefsModule {}