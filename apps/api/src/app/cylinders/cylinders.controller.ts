import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete
} from '@nestjs/common';

import { Cylinder } from '@cedar-angular/api-interfaces';
import { CylindersService } from './cylinders.service';

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
    @Body('expDate') expDate: string,
    @Body('vendorID') vendorID: string,
    @Body('epaGasCodes') epaGasCodes: string[],
    @Body('componentGases') componentGases: {
      name: string;
      amount: number;
      amountType: string;
    }[]
  ) {
    return this.cylindersService.addCylinder(cylinderID, expDate, vendorID, epaGasCodes, componentGases);
  }

  @Patch(':id')
  updateCylinder(
    @Param('id') id: string,
    @Body('cylinderID') cylinderID: string,
    @Body('expDate') expDate: string,
    @Body('vendorID') vendorID: string,
    @Body('epaGasCodes') epaGasCodes: string[],
    @Body('componentGases') componentGases: {
      name: string;
      amount: number;
      amountType: string;
    }[]
  ) {
    return this.cylindersService.updateCylinder(id, cylinderID, expDate, vendorID, epaGasCodes, componentGases);
  }

  @Delete(':id')
  deleteCylinder(@Param('id') id: string) {
    return this.cylindersService.deleteCylinder(id);
  }
}
