export interface UserDetailEntity {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  password: string;
  mobile: string;
  role: string;
  image: string;
  gender: string;
  birthDate: string;
}

export interface LoginParams {
  mobile: string;
  otp: string;
}

export interface LoginResponse {
  id: number;
  name: string;
  mobile: string;
  role: string;
  email: string;
  photo: string;
}

export interface UserState {
  user: UserDetailEntity | null;
}
