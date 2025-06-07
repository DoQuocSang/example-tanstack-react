export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: IHair;
  ip: string;
  address: IAddress;
  macIAddress: string;
  university: string;
  bank: IBank;
  company: ICompany;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: ICrypto;
  role: string;
}

export interface IUsersResponse {
  users: IUser[];
  total: number;
  skip: number;
  limit: number;
}

export interface IHair {
  color: string;
  type: string;
}

export interface ICoordinates {
  lat: number;
  lng: number;
}

export interface IAddress {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: ICoordinates;
  country: string;
}

export interface IBank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

export interface ICompany {
  department: string;
  name: string;
  title: string;
  address: IAddress;
}

export interface ICrypto {
  coin: string;
  wallet: string;
  network: string;
}
