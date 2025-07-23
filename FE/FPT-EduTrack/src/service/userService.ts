import http from "./axios";

export async function userLogin(email: string, password: string) {
  try {
    const response = await http.post("Users/login", { email, password });

    if (response.data.success) {
      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        message: response.data.message,
      };
    } else {
      // Nếu success = false, throw error với message từ API
      throw new Error(response.data.message || "Đăng nhập thất bại");
    }
  } catch (error: unknown) {
    console.error("Login error:", error);

    // Kiểm tra nếu có response từ server
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }

    // Kiểm tra các trường hợp lỗi khác
    if (
      error instanceof Error &&
      error.message &&
      error.message !== "Network Error"
    ) {
      throw new Error(error.message);
    }

    // Lỗi mặc định
    throw new Error("Lỗi kết nối. Vui lòng kiểm tra kết nối mạng và thử lại.");
  }
}

export async function createUser(
  email: string,
  fullName: string,
  password: string,
  confirmPassword: string,
  role: number
) {
  try {
    const response = await http.post("Users/create", {
      email: email,
      fullName: fullName,
      password: password,
      roleId: role,
      confirmPassword: confirmPassword,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function updateUser(
  id: number,
  email: string,
  fullname: string,
  isActive: boolean,
  roleId: number
) {
  try {
    const response = await http.put(`/api/Users/${id}`, {
      id,
      email,
      fullname,
      roleId,
      isActive,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getAllUsers(pageNumber: number, pageSize: number) {
  try {
    const response = await http.get(
      `Users/getUser?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getUserByEmail(email: string) {
  try {
    const response = await http.get(`user/search-user-by-email?Email=${email}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getCurrentUser() {
  try {
    const response = await http.get("user/get-current-user");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function activateUser(email: string, newPassword: string) {
  try {
    const response = await http.put("user/activate-user", {
      email,
      newPassword,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
}
