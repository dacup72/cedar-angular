import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';

import { Cylinder } from '@cedar-angular/api-interfaces';
import { CylindersService } from './cylinders.service';

@Controller('cylinder')
export class CylindersController {
    constructor(private readonly cylindersService: CylindersService) { }

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
        @Body('title') title: string,
        @Body('details') details: string
    ) {
        return this.cylindersService.addCylinder(title, details);
    }

    @Patch(':id')
    updateCylinder(
        @Param('id') id: string,
        @Body('title') title: string,
        @Body('details') details: string
    ) {
        return this.cylindersService.updateCylinder(id, title, details);
    }

    @Delete(':id')
    deleteCylinder(@Param('id') id: string) {
        return this.cylindersService.deleteCylinder(id);
    }
}
