import { Module } from '@nestjs/common';

import { CylinderTrackerStateService } from './cylinder-tracker-state.service';
import { CylinderTrackerStateController } from './cylinder-tracker-state.controller';

@Module({
  imports: [],
  controllers: [CylinderTrackerStateController],
  providers: [CylinderTrackerStateService]
})
export class CylinderTrackerStateModule {}
