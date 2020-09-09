import { Injectable, NotFoundException } from '@nestjs/common';
import { Cylinder } from '@cedar-all/core-data';

@Injectable()
export class CylindersService {
  // Temporary database
  private cylinders: Cylinder[] = [
    {
      id: '0',
      cylinderID: 'EB0078736',
      expirationDate: '1992-08-09',
      vendorID: '44',
      epaGasTypeCodes: ['NOX', 'SO2'],
      componentGases: [
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'NOX',
          gasConcentration: 25.4,
          uom: 'ppm'
        },
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'SO2',
          gasConcentration: 14.8,
          uom: 'ppm'
        }
      ],
      state: 'spare',
      certificationImage: 'image url',
      hasBeenUsedForQA: false,
      createdByPartialEdit: false,
      editHistory: "<history goes here />",
      errorList: []
    },
    {
      id: '1',
      cylinderID: 'EB0064498',
      expirationDate: '2021-05-23',
      vendorID: '23',
      epaGasTypeCodes: ['NO2', 'O2'],
      componentGases: [
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'NO2',
          gasConcentration: 25.4,
          uom: 'ppm'
        },
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'O2',
          gasConcentration: 14.8,
          uom: '%'
        }
      ],
      state: 'spare',
      certificationImage: 'image url',
      hasBeenUsedForQA: false,
      createdByPartialEdit: false,
      editHistory: "<history goes here />",
      errorList: []
    }
  ];

  getAllCylinders(): Cylinder[] {
    return [...this.cylinders];
  }

  addCylinder(
    cylinderID: string,
    expirationDate: string,
    vendorID: string,
    epaGasTypeCodes: string[],
    componentGases: {
      qaGasDefCode: string;
      epaGasCode: string;
      gasConcentration: number;
      uom: string;
    }[],
    state: string
  ) {
    const id = Math.random().toString();
    const certificationImage = 'image url';
    const hasBeenUsedForQA = false;
    const createdByPartialEdit = false;
    const editHistory = '<history goes here />';
    const errorList = [];

    const newCylinder = {
      id,
      cylinderID,
      expirationDate,
      vendorID,
      epaGasTypeCodes,
      componentGases,
      state,
      certificationImage,
      hasBeenUsedForQA,
      createdByPartialEdit,
      editHistory,
      errorList
    };
    this.cylinders.push(newCylinder);
    return { ...newCylinder };
  }

  getCylinder(id: string): Cylinder {
    const { cylinder } = this.findCylinder(id);
    return { ...cylinder };
  }

  updateCylinder(
    id,
    cylinderID: string,
    expirationDate: string,
    vendorID: string,
    epaGasTypeCodes: string[],
    componentGases: {
      qaGasDefCode: string;
      epaGasCode: string;
      gasConcentration: number;
      uom: string;
    }[],
    state: string
  ) {
    const { index, cylinder } = this.findCylinder(id);
    const updatedCylinder = { ...cylinder };
    if (cylinderID) {
      updatedCylinder.cylinderID = cylinderID;
    }
    if (expirationDate) {
      updatedCylinder.expirationDate = expirationDate;
    }
    if (vendorID) {
      updatedCylinder.vendorID = vendorID;
    }
    if (epaGasTypeCodes) {
      updatedCylinder.epaGasTypeCodes = epaGasTypeCodes;
    }
    if (componentGases) {
      updatedCylinder.componentGases = componentGases;
    }
    if (state) {
      updatedCylinder.state = state;
    }
    this.cylinders[index] = updatedCylinder;
    return { ...updatedCylinder };
  }

  deleteCylinder(id: string) {
    const { index } = this.findCylinder(id);
    this.cylinders.splice(index, 1);
    return { id: id };
  }

  private findCylinder(id: string): { index: number; cylinder: Cylinder } {
    const index = this.cylinders.findIndex(cylinder => id === cylinder.id);
    const cylinder = this.cylinders[index];
    if (!cylinder) throw new NotFoundException('Could not find cylinder.');
    return { index, cylinder };
  }
}
