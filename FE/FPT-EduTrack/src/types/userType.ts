export interface User {
  id: number;
  email: string;
  fullname: string;
  createdAt: string; // ISO string
  isActive: boolean;
  isDeleted: boolean;
  roleId: number;
  roleName: string;
}
export interface UserResponse {
  success: boolean;
  message: string;
  data: User[];
  count: number;
  timestamp: string;
}

export interface UserCreateRequest {
  email: string;
  fullname: string;
  password: string;
  roleId: number;
}
export interface UserUpdateRequest {
  id: number;
  email: string;
  fullname: string;
  isActive: boolean;
  roleId: number;
}
