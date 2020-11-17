import { ErrorInfo } from '@cedar-angular/api-interfaces';


export interface QAGasProfile {
    readonly id: string;
    readonly pid: number;
    readonly name: string;
    readonly unitNumber: number;
    readonly cedarGasCode: string;
    readonly analyzerSpanType: string;
    readonly qaTestType: string;
    readonly gasLevel: string;
    readonly uom: string;
    readonly instrumentSpan: number;
    readonly minAllowableGasValue: number;
    readonly maxAllowableGasValue: number;
    gasConcentration: number;
    cylinderID: string;
    expirationDate: string;
    vendorID: string;
    epaGasTypeCode: string;
    readonly cylPressure?: number;
    cylPressureUOM?: number;
    readonly errorList: ErrorInfo[];
}