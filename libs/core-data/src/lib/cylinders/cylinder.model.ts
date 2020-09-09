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
