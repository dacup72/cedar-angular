import { Injectable } from '@nestjs/common';
import { UnitDef } from '@cedar-all/core-data';

@Injectable()
export class UnitDefsService {
  // Temporary Database
  private unitDefs: UnitDef[] = require('./unit-def-data.json');

  getAllUnitDefs(): UnitDef[] {
    return [...this.unitDefs];
  }
}
