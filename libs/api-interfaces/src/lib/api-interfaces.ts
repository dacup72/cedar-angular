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
  qaGasDefCode: string;
  epaGasCode: string;
  gasConcentration: number;
  uom: string;
}

export interface ErrorInfo {
  severity: number;
  desc: string;
}