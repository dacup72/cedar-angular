import { Injectable, NotFoundException } from '@nestjs/common';
import { Cylinder } from '@cedar-angular/api-interfaces';

@Injectable()
export class CylindersService {
  // Temporary database
  private cylinders: Cylinder[] = [
    {
      id: '0',
      cylinderID: '4557324',
      expDate: 'March 1st',
      vendorID: 'Vendor id 44',
      epaGasCodes: ['NOX', 'SO2'],
      componentGases: [
        {
          name: 'NOX',
          amount: 25.4,
          amountType: 'ppm'
        },
        {
          name: 'SO2',
          amount: 14.8,
          amountType: 'ppm'
        }
      ]
    },
    {
      id: '1',
      cylinderID: '55587',
      expDate: 'April 1st',
      vendorID: 'Vendor id 44',
      epaGasCodes: ['NOX', 'O2'],
      componentGases: [
        {
          name: 'NOX',
          amount: 25.4,
          amountType: 'ppm'
        },
        {
          name: 'O2',
          amount: 12.3,
          amountType: 'ppm'
        }
      ]
    }
  ];

  getAllCylinders(): Cylinder[] {
    return [...this.cylinders];
  }

  addCylinder(
    cylinderID: string,
    expDate: string,
    vendorID: string,
    epaGasCodes: string[],
    componentGases: {
      name: string;
      amount: number;
      amountType: string;
    }[]
  ) {
    const id = Math.random().toString();

    const newCylinder = {
      id,
      cylinderID,
      expDate,
      vendorID,
      epaGasCodes,
      componentGases
    };

    this.cylinders.push(newCylinder);
    return { id: newCylinder.id };
  }

  getCylinder(id: string): Cylinder {
    const { cylinder } = this.findCylinder(id);
    return { ...cylinder };
  }

  updateCylinder(
    id: string,
    cylinderID: string,
    expDate: string,
    vendorID: string,
    epaGasCodes: string[],
    componentGases: {
      name: string;
      amount: number;
      amountType: string;
    }[]
  ) {
    const { index, cylinder } = this.findCylinder(id);
    const updatedCylinder = { ...cylinder };
    if (cylinderID) {
      updatedCylinder.cylinderID = cylinderID;
    }
    if (expDate) {
      updatedCylinder.expDate = expDate;
    }
    if (vendorID) {
      updatedCylinder.vendorID = vendorID;
    }
    if (epaGasCodes) {
      updatedCylinder.epaGasCodes = epaGasCodes;
    }
    if (componentGases) {
      updatedCylinder.componentGases = componentGases;
    }
    this.cylinders[index] = updatedCylinder;
    return { id: updatedCylinder.id };
  }

  deleteCylinder(id: string) {
    const { index } = this.findCylinder(id);
    this.cylinders.splice(index, 1);
    return { id: id };
  }

  private findCylinder(id: string): { index: number; cylinder: Cylinder } {
    const index = this.cylinders.findIndex(cylinder => id == cylinder.id);
    const cylinder = this.cylinders[index];
    if (!cylinder) throw new NotFoundException('Could not find cylinder.');
    return { index, cylinder };
  }
}
