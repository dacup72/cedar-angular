import { ComponentGas, ComponentGas2, ErrorInfo } from '@cedar-angular/api-interfaces';

export interface Cylinder {
  id: string;
  cylinderID: string;
  expDate: string;
  vendorID: string;
  epaGasCodes: string[];
  componentGases: ComponentGas[];
  status: string;
}

export interface Cylinder2 {
  recordID: String;
  cylinderID: String;
  expirationDate: String;
  vendorID: String;
  epaGasTypeCode: String;
  componentGases: ComponentGas2[];
  state: String;
  certificationImage: String;
  hasBeenUsedForQA: Boolean;
  createdByPartialEdit: Boolean;
  editHistory: String;
  errorList: ErrorInfo[];
}
