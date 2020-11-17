import {
  Controller,
  Get,
  Patch,
  Body,
  Param
} from '@nestjs/common';

import { QAGasProfile } from '@cedar-all/core-data';
import { GasProfilesService } from './gas-profiles.service';

@Controller('qaGasProfile')
export class GasProfilesController {
  constructor(private readonly gasProfilesService: GasProfilesService) {}

  @Get()
  getAllGasProfiles(): QAGasProfile[] {
    return this.gasProfilesService.getAllGasProfiles();
  }

  @Patch(':id')
  updateCylinder(
    @Param('id') id: string,
    @Body('gasConcentration') gasConcentration: number,
    @Body('cylinderID') cylinderID: string,
    @Body('expirationDate') expirationDate: string,
    @Body('vendorID') vendorID: string,
    @Body('epaGasTypeCode') epaGasTypeCode: string
  ) {
    return this.gasProfilesService.updateGasProfile(id, gasConcentration, cylinderID, expirationDate, vendorID, epaGasTypeCode);
  }
}
