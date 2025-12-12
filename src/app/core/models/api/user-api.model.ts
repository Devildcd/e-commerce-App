export interface ApiUserGeoLocation {
  lat: string;
  long: string;
}

export interface ApiUserAddress {
  geolocation: ApiUserGeoLocation;
  city: string;
  street: string;
  number: number;
  zipcode: string;
}

export interface ApiUserName {
  firstname: string;
  lastname: string;
}

export interface ApiUser {
  id: number;
  email: string;
  username: string;
  password: string;
  name: ApiUserName;
  address: ApiUserAddress;
  phone: string;
  __v?: number;
}
