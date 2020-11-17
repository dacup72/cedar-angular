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
      minAllowableGasValue: 1,
      maxAllowableGasValue: 100,
      gasConcentration: 0,
      cylinderID: '',
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
      uom: '%',
      instrumentSpan: 2,
      minAllowableGasValue: 1,
      maxAllowableGasValue: 100,
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
    if (cylinderID) {
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
