import {
    Controller,
    Get,
    Body,
    Patch
  } from '@nestjs/common';
  
  import { CylinderTrackerAppState } from '@cedar-all/core-data';
  import { CylinderTrackerStateService } from './cylinder-tracker-state.service';
  
  @Controller('cylinderTrackerState')
  export class CylinderTrackerStateController {
    constructor(private readonly cylinderTrackerStateService: CylinderTrackerStateService) {}
  
    @Get()
    getCylinderTrackerState(): CylinderTrackerAppState[] {
      return this.cylinderTrackerStateService.getCylinderTrackerState();
    }
  
    @Patch()
    updateCylinderTrackerState(
      @Body('panelsReversed') panelsReversed: boolean,
    ) {
      return this.cylinderTrackerStateService.updateCylinderTrackerState(panelsReversed);
    }
  }
  