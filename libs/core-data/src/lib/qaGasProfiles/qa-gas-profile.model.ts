import { ErrorInfo } from '@cedar-angular/api-interfaces';

// export interface QAGasProfile {
//     readonly id: string;
//     readonly pid: number;
//     readonly name: string;
//     readonly unitNumber: number;
//     readonly cedarGasCode: string;
//     readonly analyzerSpanType: string;
//     readonly qaTestType: string;
//     readonly gasLevel: string;
//     readonly uom: string;
//     readonly instrumentSpan: number;
//     readonly minAllowableGasValue: number;
//     readonly maxAllowableGasValue: number;
//     gasConcentration: number;
//     cylinderID: string;
//     expirationDate: string;
//     vendorID: string;
//     epaGasTypeCode: string;
//     readonly cylPressure?: number;
//     cylPressureUOM?: number;
//     readonly errorList: ErrorInfo[];
// }

export interface QAGasProfile {
    readonly tagID: string;
    readonly desc: string;
    readonly unit: string;
    readonly cedarGasCode: string;
    readonly analyzerSpanType: string;
    readonly qaTestType: string;
    readonly gasLevel: string;
    readonly uom: string;
    readonly instSpan: string;
    readonly allowableGasValueMin: string;
    readonly allowableGasValueMax: string;
    readonly allowableGasValueMin2?: string;
    readonly allowableGasValueMax2?: string;
    cylGasConc: string;
    cylID: string;
    cylExpDate: string;
    cylVendorID: string;
    cylEpaGasTypeCode: string;
    cylPressure: string;
    cylPressureUOM: string;
    errorInfo: ErrorInfo[];
}

export interface GasProfileFilters {
    gasCodes: string[];
    unitNumber: string;
    testType: string;
}
