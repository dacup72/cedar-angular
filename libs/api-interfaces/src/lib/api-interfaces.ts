export interface Message {
  message: string;
}

export interface User {
  id: number,
  username: string,
  email: string,
  password: string,
  token?: string
}

export interface ComponentGas {
  name: string;
  amount: number;
  amountType: string;
}

export interface ComponentGas2 {
  qaGasDefCode: String;
  epaGasCode: String;
  gasConcentration: Number;
  uom: String;
}

export interface ErrorInfo {
  severity: Number;
  desc: String;
}