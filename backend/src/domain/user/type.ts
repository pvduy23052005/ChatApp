export interface IUserProps {
  id?: string | undefined;
  fullName: string;
  email: string;
  password: string;
  avatar?: string | undefined;
  statusOnline?: string | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export interface IUserProfile {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  statusOnline: string;
}

export interface IUserRestore {
  id?: string | undefined;
  _id?: any;
  fullName: string;
  email: string;
  password: string;
  avatar?: string | undefined;
  statusOnline?: string | null | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export interface IUpdateProfile {
  fullName?: string;
  avatar?: string;
}