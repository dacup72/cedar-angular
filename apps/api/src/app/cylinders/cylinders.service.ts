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
    },
    {
      id: '2',
      cylinderID: 'EB739902',
      expirationDate: '2022-010-10',
      vendorID: '3',
      epaGasTypeCodes: ['CO'],
      componentGases: [
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'CO',
          gasConcentration: 14,
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
      id: '3',
      cylinderID: 'EF900034',
      expirationDate: '2020-12-24',
      vendorID: '3',
      epaGasTypeCodes: ['HE', 'BALN'],
      componentGases: [
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'HE',
          gasConcentration: 20.2,
          uom: 'ppm'
        },
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'BALN',
          gasConcentration: 5,
          uom: '%'
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
      id: '4',
      cylinderID: 'EB008876',
      expirationDate: '2021-02-04',
      vendorID: '8',
      epaGasTypeCodes: ['O2'],
      componentGases: [
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'O2',
          gasConcentration: 10,
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
      id: '5',
      cylinderID: 'EB049944',
      expirationDate: '2021-07-14',
      vendorID: '20',
      epaGasTypeCodes: ['NO', 'O2', 'CO2'],
      componentGases: [
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'NO',
          gasConcentration: 31.4,
          uom: 'ppm'
        },
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'O2',
          gasConcentration: 9.8,
          uom: 'ppm'
        },
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'CO2',
          gasConcentration: 15,
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
      id: '6',
      cylinderID: 'EB055576',
      expirationDate: '2021-05-20',
      vendorID: '14',
      epaGasTypeCodes: ['NOX'],
      componentGases: [
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'NOX',
          gasConcentration: 18.7,
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
      id: '7',
      cylinderID: 'EB009808',
      expirationDate: '2022-11-11',
      vendorID: '12',
      epaGasTypeCodes: ['CH4', 'CO2'],
      componentGases: [
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'CH4',
          gasConcentration: 16,
          uom: 'ppm'
        },
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'CO2',
          gasConcentration: 6.6,
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
      id: '8',
      cylinderID: 'EB0101023',
      expirationDate: '2020-05-14',
      vendorID: '13',
      epaGasTypeCodes: ['SO2'],
      componentGases: [
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'SO2',
          gasConcentration: 28.2,
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
      id: '9',
      cylinderID: 'EB2992830',
      expirationDate: '2019-12-01',
      vendorID: '28',
      epaGasTypeCodes: ['PPN', 'CO'],
      componentGases: [
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'PPN',
          gasConcentration: 10,
          uom: '%'
        },
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'CO',
          gasConcentration: 30.8,
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
      id: '10',
      cylinderID: 'EG283992',
      expirationDate: '2021-06-06',
      vendorID: '7',
      epaGasTypeCodes: ['H2S', 'O2', 'NOX'],
      componentGases: [
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'H2S',
          gasConcentration: 8.4,
          uom: 'ppm'
        },
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'O2',
          gasConcentration: 19.8,
          uom: 'ppm'
        },
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'NOX',
          gasConcentration: 12.9,
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
      id: '11',
      cylinderID: 'EF423338',
      expirationDate: '2020-11-22',
      vendorID: '20',
      epaGasTypeCodes: ['N2O'],
      componentGases: [
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'N2O',
          gasConcentration: 20,
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
      id: '12',
      cylinderID: 'EB0311298',
      expirationDate: '2021-05-23',
      vendorID: '18',
      epaGasTypeCodes: ['BALN'],
      componentGases: [
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'BALN',
          gasConcentration: 30,
          uom: '%'
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
      id: '13',
      cylinderID: 'EG600908',
      expirationDate: '2018-02-23',
      vendorID: '23',
      epaGasTypeCodes: ['CO2', 'CO', 'NO'],
      componentGases: [
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'CO2',
          gasConcentration: 25.4,
          uom: 'ppm'
        },
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'CO',
          gasConcentration: 22.8,
          uom: 'ppm'
        },
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'NO',
          gasConcentration: 10.8,
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
      id: '14',
      cylinderID: 'EG8000003',
      expirationDate: '2022-03-14',
      vendorID: '5',
      epaGasTypeCodes: ['CH4', 'SO2'],
      componentGases: [
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'CH4',
          gasConcentration: 5.4,
          uom: 'ppm'
        },
        {
          qaGasDefCode: 'unknown',
          epaGasCode: 'SO2',
          gasConcentration: 19.8,
          uom: 'ppm'
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
