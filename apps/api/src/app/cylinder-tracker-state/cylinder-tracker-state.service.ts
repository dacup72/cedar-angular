import { Injectable } from '@nestjs/common';
import { CylinderTrackerAppState } from '@cedar-all/core-data';
 
@Injectable()
export class CylinderTrackerStateService {
  private cylinderTrackerState: CylinderTrackerAppState[] = require('./cylinder-tracker-app-state-data.json');

  getCylinderTrackerState(): CylinderTrackerAppState[] {
    return [...this.cylinderTrackerState];
  }

  updateCylinderTrackerState(
    panelsReversed: boolean
  ) {
    const updatedCylinderTrackerState = { ...this.cylinderTrackerState[0] };

    if (panelsReversed || panelsReversed === false) {
        updatedCylinderTrackerState.panelsReversed = panelsReversed;
    }

    this.cylinderTrackerState = [updatedCylinderTrackerState]
    return { ...updatedCylinderTrackerState };
  }
}
