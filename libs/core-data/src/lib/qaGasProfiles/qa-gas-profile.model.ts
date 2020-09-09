export interface QAGasProfile {
    readonly pid: number;
    readonly name: string;
    readonly unitNumber: number;
    readonly unitName: string;
    readonly cedarGasCode: string;
    readonly analyzerSpanType: string;
    readonly qaTestType: string;
    readonly gasLevel: string;
    uom: string;
    readonly minAllowableGasValue: number;
    readonly maxAllowableGasValue: number;
    gasConcentration: number;
    cylinderID: string;
    expirationDate: string;
    vendorID: string;
    epaGasTypeCode: string;
    readonly instrumentSpan: number;
    readonly cylPressure?: number;
    cylPressureUOM?: number;
}