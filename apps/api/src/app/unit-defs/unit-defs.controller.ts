import { Controller, Get } from '@nestjs/common';

import { UnitDef } from '@cedar-all/core-data';
import { UnitDefsService } from './unit-defs.service';

@Controller('unitDef')
export class UnitDefsController {
  constructor(private readonly unitDefsService: UnitDefsService) {}

  @Get()
  getAllUnitDefs(): UnitDef[] {
    return this.unitDefsService.getAllUnitDefs();
  }
}
