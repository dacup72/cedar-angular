export interface QAGasProfile {
    readonly pid: Number;
    readonly name: String;
    readonly unitNumber: Number;
    readonly unitName: String;
    readonly cedarGasCode: String;
    readonly analyzerSpanType: String;
    readonly qaTestType: String;
    readonly gasLevel: String;
    uom: String;
    readonly minAllowableGasValue: Number;
    readonly maxAllowableGasValue: Number;
    gasConcentration: Number;
    cylinderID: String;
    expirationDate: String;
    vendorID: String;
    epaGasTypeCode: String;
    readonly instrumentSpan: Number;
    readonly cylPressure?: Number;
    cylPressureUOM?: Number;
}