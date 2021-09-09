import { ComponentGas, ErrorInfo } from '@cedar-angular/api-interfaces';

export interface Cylinder {
  id: string;
  cylinderID: string;
  expirationDate: string;
  vendorID: string;
  epaGasTypeCodes: string[];
  componentGases: ComponentGas[];
  state: string;
  certificationImage: string;
  hasBeenUsedForQA: boolean;
  createdByPartialEdit: boolean;
  editHistory: string;
  errorList: ErrorInfo[];
}

export const emptyCylinder: Cylinder = {
  id: null,
  cylinderID: '',
  expirationDate: '',
  vendorID: '',
  epaGasTypeCodes: [],
  componentGases: [],
  state: 'spare',
  certificationImage: '',
  hasBeenUsedForQA: false,
  createdByPartialEdit: false,
  editHistory: '',
  errorList: []
};