export interface Cylinder {
    id: string;
    cylinderID: string;
    expDate: string;
    vendorID: string;
    epaGasCodes: string[];
    componentGases: ComponentGas[];
    status: string;
  }

export interface ComponentGas {
  name: string;
  amount: number;
  amountType: string;
}