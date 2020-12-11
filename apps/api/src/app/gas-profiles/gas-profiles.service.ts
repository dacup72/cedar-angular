import { Injectable, NotFoundException } from '@nestjs/common';
import { QAGasProfile } from '@cedar-all/core-data';

@Injectable()
export class GasProfilesService {
  // Temporary database
  private gasProfiles: QAGasProfile[] = [
    {
      id: 'sdfkjh398dj',
      pid: 12535784,
      name: 'NOx/L Calibration Span',
      unitNumber: 14,
      cedarGasCode: 'NOX',
      analyzerSpanType: 'LOW',
      qaTestType: 'CAL',
      gasLevel: 'LOW',
      uom: 'ppm',
      instrumentSpan: 4,
      minAllowableGasValue: 4,
      maxAllowableGasValue: 20,
      gasConcentration: 0,
      cylinderID: 'EB0078736',
      expirationDate: '',
      vendorID: '',
      epaGasTypeCode: '',
      errorList: []
    },
    {
      id: 'sdkjhfj3j8doj3s',
      pid: 56928301,
      name: 'NOx/H Linearity Mid',
      unitNumber: 3,
      cedarGasCode: 'NOX',
      analyzerSpanType: 'HIGH',
      qaTestType: 'LINEARITY',
      gasLevel: 'MID',
      uom: 'ppm',
      instrumentSpan: 2,
      minAllowableGasValue: 4,
      maxAllowableGasValue: 20,
      gasConcentration: 0,
      cylinderID: 'EB0078736',
      expirationDate: '',
      vendorID: '',
      epaGasTypeCode: '',
      errorList: []
    },
    {
      id: 'lsmrovuworjmc',
      pid: 793750294,
      name: 'O2/L Calibration Span',
      unitNumber: 3,
      cedarGasCode: 'O2',
      analyzerSpanType: 'LOW',
      qaTestType: 'CAL',
      gasLevel: 'LOW',
      uom: 'ppm',
      instrumentSpan: 4,
      minAllowableGasValue: 5,
      maxAllowableGasValue: 15,
      gasConcentration: 0,
      cylinderID: 'EB0064498',
      expirationDate: '',
      vendorID: '',
      epaGasTypeCode: '',
      errorList: []
    },
    {
      id: 'jsdlfksjoirnvur',
      pid: 9988337744,
      name: 'O2/H Linearity Mid',
      unitNumber: 3,
      cedarGasCode: 'O2',
      analyzerSpanType: 'HIGH',
      qaTestType: 'LINEARITY',
      gasLevel: 'MID',
      uom: 'ppm',
      instrumentSpan: 2,
      minAllowableGasValue: 15,
      maxAllowableGasValue: 40,
      gasConcentration: 0,
      cylinderID: '',
      expirationDate: '',
      vendorID: '',
      epaGasTypeCode: '',
      errorList: []
    }
  ];

  getAllGasProfiles(): QAGasProfile[] {
    return [...this.gasProfiles];
  }

  updateGasProfile(
    id: string,
    gasConcentration: number,
    cylinderID: string,
    expirationDate: string,
    vendorID: string,
    epaGasTypeCode: string
  ) {
    const { index, gasProfile } = this.findGasProfile(id);
    const updatedGasProfile = { ...gasProfile };
    if (gasConcentration) {
      updatedGasProfile.gasConcentration = gasConcentration;
    }
    if (cylinderID || cylinderID === '') {
      updatedGasProfile.cylinderID = cylinderID;
    }
    if (expirationDate) {
      updatedGasProfile.expirationDate = expirationDate;
    }
    if (vendorID) {
      updatedGasProfile.vendorID = vendorID;
    }
    if (epaGasTypeCode) {
      updatedGasProfile.epaGasTypeCode = epaGasTypeCode;
    }
    
    this.gasProfiles[index] = updatedGasProfile;    
    return { ...updatedGasProfile };
  }

  private findGasProfile(id: string): { index: number; gasProfile: QAGasProfile } {
    const index = this.gasProfiles.findIndex(gasProfile => id === gasProfile.id);
    const gasProfile = this.gasProfiles[index];
    if (!gasProfile) throw new NotFoundException('Could not find gasProfile.');
    return { index, gasProfile };
  }
}
