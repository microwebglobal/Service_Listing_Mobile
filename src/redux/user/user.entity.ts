export interface UserDetailEntity {
  id: number;
  name: string;
  userName: string;
  email: string;
  password: string;
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
  user: UserDetailEntity | null;
}
