import http from "./axios";

export async function userLogin(email: string, password: string) {
  try {
    const response = await http.post("Users/login", { email, password });

    if (response.data.success) {
      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    }
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}

export async function createUser(
  email: string,
  fullName: string,
  departmentId: string,
  role: number,
  rank: number,
  baseSalary: number
) {
  try {
    const response = await http.post("user/create", {
      email: email,
      fullName: fullName,
      department: departmentId,
      role: role,
      rank: rank,
      baseSalary: baseSalary,
    });
    return response.data;
  } catch (error: any) {
    throw error.response
      ? error.response.data
      : new Error("An unexpected error occurred");
  }
}

export async function updateUser(
  id: string,
  email: string,
  fullName: string,
  departmentId: string,
  role: number,
  rank: number,
  status: number,
  baseSalary: number
) {
  try {
    const response = await http.put(`user/update-users`, {
      userId: id,
      fullName,
      email,
      departmentId,
      role,
      rank,
      status,
      baseSalary,
    });
    return response.data;
  } catch (error: any) {
    throw error.response
      ? error.response.data
      : new Error("An unexpected error occurred");
  }
}

export async function getAllUsers(pageNumber: number, pageSize: number) {
  try {
    const response = await http.get(
      `user/get-users?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response
      ? error.response.data
      : new Error("An unexpected error occurred");
  }
}

export async function getUserByEmail(email: string) {
  try {
    const response = await http.get(`user/search-user-by-email?Email=${email}`);
    return response.data;
  } catch (error: any) {
    throw error.response
      ? error.response.data
      : new Error("An unexpected error occurred");
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  try {
    const response = await http.put("user/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    throw error.response
      ? error.response.data
      : new Error("An unexpected error occurred");
  }
}

export async function getCurrentUser() {
  try {
    const response = await http.get("user/get-current-user");
    return response.data;
  } catch (error: any) {
    throw error.response
      ? error.response.data
      : new Error("An unexpected error occurred");
  }
}

export async function activateUser(email: string, newPassword: string) {
  try {
    const response = await http.put("user/activate-user", {
      email,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    throw error.response
      ? error.response.data
      : new Error("An unexpected error occurred");
  }
}
