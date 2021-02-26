import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete
} from '@nestjs/common';

import { Cylinder } from '@cedar-all/core-data';
import { CylindersService } from './cylinders.service';
import { ErrorInfo } from '@cedar-angular/api-interfaces';

@Controller('cylinder')
export class CylindersController {
  constructor(private readonly cylindersService: CylindersService) {}

  @Get()
  getAllCylinders(): Cylinder[] {
    return this.cylindersService.getAllCylinders();
  }

  @Get(':id')
  getCylinder(@Param('id') id: string): Cylinder {
    return this.cylindersService.getCylinder(id);
  }

  @Post()
  addCylinder(
    @Body('cylinderID') cylinderID: string,
    @Body('expirationDate') expirationDate: string,
    @Body('vendorID') vendorID: string,
    @Body('epaGasTypeCodes') epaGasTypeCodes: string[],
    @Body('componentGases') componentGases: {
      qaGasDefCode: string;
      epaGasCode: string;
      gasConcentration: number;
      uom: string;
    }[],
    @Body('state') state: string
  ) {
    return this.cylindersService.addCylinder(cylinderID, expirationDate, vendorID, epaGasTypeCodes, componentGases, state);
  }

  @Patch(':id')
  updateCylinder(
    @Param('id') id: string,
    @Body('cylinderID') cylinderID: string,
    @Body('expirationDate') expirationDate: string,
    @Body('vendorID') vendorID: string,
    @Body('epaGasTypeCodes') epaGasTypeCodes: string[],
    @Body('componentGases') componentGases: {
      qaGasDefCode: string;
      epaGasCode: string;
      gasConcentration: number;
      uom: string;
    }[],
    @Body('state') state: string,
    @Body('errorList') errorList: ErrorInfo[]
  ) {
    return this.cylindersService.updateCylinder(id, cylinderID, expirationDate, vendorID, epaGasTypeCodes, componentGases, state, errorList);
  }

  @Delete(':id')
  deleteCylinder(@Param('id') id: string) {
    return this.cylindersService.deleteCylinder(id);
  }
}
