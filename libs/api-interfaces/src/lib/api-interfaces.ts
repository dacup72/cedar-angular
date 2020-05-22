export interface Message {
  message: string;
}

export interface Cylinder {
  id: string;
  cylinderID: string;
  expDate: string;
  vendorID: string;
  epaGasCodes: string[];
  componentGases: {
    name: string;
    amount: number;
    amountType: string;
  }[];
}
