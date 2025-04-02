export interface UserDetailEntity {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: string;
  photo: string;
  gender: string;
  dob: string;
}

export interface LoginParams {
  mobile: string;
  otp: string;
}

export interface LoginResponse {
  first_time_login: boolean;
  user: {
    id: number;
    name: string;
    mobile: string;
    role: string;
    email: string;
    photo: string;
  };
}

export interface UserState {
  user: UserDetailEntity;
}
