import { ComponentGas, ErrorInfo } from '@cedar-angular/api-interfaces';
import { QAGasProfile } from '../qaGasProfiles/qa-gas-profile.model';


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
  cylinderID: string,
  gasCodes: string[],
  testType: string[],
  unitIDs: string[],
  concentrations: {
    cedarGasCode: string,
    allowableGasValueMin: string,
    allowableGasValueMax: string,
    uom: string,
    changed: boolean
  }[],
  state: string;
  singleConcentrations: {
    cedarGasCode: string,
    concentration: string,
    uom: string,
    changed: boolean
  }[]
}

export const emptyCylinderFilters: CylinderFilters = {
  cylinderID: '',
  gasCodes: [],
  testType: [],
  unitIDs: [],
  concentrations: [],
  state: '',
  singleConcentrations: []
}
