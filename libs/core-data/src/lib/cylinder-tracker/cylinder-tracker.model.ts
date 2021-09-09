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

export interface GasProfileFilters {
    gasCodes: string[],
    testType: string[],
    unitIDs: string[],
    singleConcentrations: {
        cedarGasCode: string,
        concentration: string,
        uom: string,
        changed: boolean
    }[];
}

export interface CylinderTrackerAppState {
    id: number,
    panelsReversed: boolean
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

export const emptyGasProfileFilters: GasProfileFilters = {
    gasCodes: [],
    testType: [],
    unitIDs: [],
    singleConcentrations: []
}

export const emptyCylinderTrackerAppState: CylinderTrackerAppState = {
    id: 0,
    panelsReversed: false
}
