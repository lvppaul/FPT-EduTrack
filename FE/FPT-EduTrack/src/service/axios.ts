import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("Missing VITE_API_URL in .env file!");
}

const http = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Quản lý trạng thái refresh token
let isRefreshing = false;
let failedQueue: {
  resolve: (value: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Interceptor thêm accessToken vào header nếu có
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Hàm refresh accessToken
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.log("No refresh token found!");
      return null; // Trả về null nhưng không xóa token
    }

    const response = await axios.post(
      `${API_URL}/api/auth/loginWithRefreshToken`,
      refreshToken,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.isSuccess) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      return accessToken;
    } else {
      console.error("API returned failure response:", response.data);
      return null; // Không xóa token nếu API trả về thất bại
    }
  } catch (error: unknown) {
    console.error("Failed to refresh token:", error);

    if (axios.isAxiosError(error)) {
      // Nếu lỗi là AxiosError, kiểm tra response status
      if (error.response?.status === 401) {
        console.log("Token expired or invalid, clearing storage...");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
      }
    }

    return null;
  }
};

// Interceptor để tự động refresh token nếu bị 401
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Đợi đến khi token mới được lấy
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return http(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        isRefreshing = false;

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return http(originalRequest);
        }
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default http;
