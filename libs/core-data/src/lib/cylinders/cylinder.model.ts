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

// export interface Cylinder {
//   recordID: string,
//   siteID: string,
//   cylinderID: string,
//   cylinderExpirationDate: string,
//   vendorID: string,
//   epaGasTypeCodes: string,
//   componentGases: ComponentGas[],
//   state: string,
//   createdByHmiEdit: string,
//   hasBeenUsedForQA: string,
//   hasError: string,
//   errorInfo: ErrorInfo[],
//   xHistory: string,
//   xOther: string,
//   certImage: string,
//   certImageType: string
// }

export interface CylinderFilters {
  cylinderID: string;
  gasCodes: string[];
  unitNumber: string;
}
