import { Injectable, NotFoundException } from '@nestjs/common';
import { Cylinder } from '@cedar-angular/api-interfaces';

@Injectable()
export class CylindersService {
  // Temporary database
  private cylinders: Cylinder[] = [
    {
      id: "0",
      title: "NOX",
      details: "This is the cylinder details",
      percentComplete: 30,
      approved: true,
    }
  ];

  getAllCylinders(): Cylinder[] {
    return [...this.cylinders];
  }

  addCylinder(title: string, details: string) {
    const id = Math.random().toString();
    const percentComplete = 0;
    const approved = true;

    const newCylinder = {
      id,
      title,
      details,
      percentComplete,
      approved
    }

    this.cylinders.push(newCylinder);
    return { id: newCylinder.id };
  }

  getCylinder(id: string): Cylinder {
    const {cylinder} = this.findCylinder(id);
    return {...cylinder};
  }

  updateCylinder(id: string, title: string, details: string) {
    const {index, cylinder} = this.findCylinder(id);
    const updatedCylinder = {...cylinder};
    if(title) {
        updatedCylinder.title = title
    }
    if(details) {
        updatedCylinder.details = details
    }
    this.cylinders[index] = updatedCylinder;
    return {id: updatedCylinder.id};
  }

  deleteCylinder(id: string) {
      const {index} = this.findCylinder(id);
      this.cylinders.splice(index, 1);
      return {id};
  }

  private findCylinder(id: string): {index: number, cylinder: Cylinder} {
    const index = this.cylinders.findIndex(cylinder => id == cylinder.id);
    const cylinder = this.cylinders[index];
    if (!cylinder) throw new NotFoundException('Could not find cylinder.')
    return {index, cylinder};
  }
}
