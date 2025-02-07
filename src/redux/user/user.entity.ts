export interface UserDetailEntity {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: string;
  image: string;
  password: string;
  gender: string;
  birthDate: string;
  address: {
    type: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postal_code: string;
  };
}

export interface LoginParams {
  mobile: string;
  otp: string;
}

export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  photo: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

export interface UserState {
  user: UserDetailEntity | null;
}
