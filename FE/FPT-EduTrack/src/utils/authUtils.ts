import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  sub: string;
  Role: string;
  exp?: number;
  iat?: number;
}

export interface UserToken {
  sub: string;
  Role: string;
}

export class AuthUtils {
  // Clear all authentication data
  static clearAuthData(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
  }

  // Get and validate token
  static getValidToken(): string | null {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.warn("Token expired");
        this.clearAuthData();
        return null;
      }

      return token;
    } catch (error) {
      console.error("Invalid token:", error);
      this.clearAuthData();
      return null;
    }
  }

  // Get user data from token
  static getUserFromToken(): UserToken | null {
    const token = this.getValidToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return {
        sub: decoded.sub,
        Role: decoded.Role,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      this.clearAuthData();
      return null;
    }
  }

  // Check if user has required role
  static hasRole(requiredRoles: string[]): boolean {
    const user = this.getUserFromToken();
    return user ? requiredRoles.includes(user.Role) : false;
  }

  // Get redirect path based on role
  static getRedirectPath(role: string): string {
    switch (role.toLowerCase()) {
      case "examiner":
        return "/examiner/dashboard";
      case "student":
        return "/student/dashboard";
      case "lecturer":
        return "/lecturer/dashboard";
      default:
        return "/";
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getValidToken() !== null;
  }

  // Save authentication data
  static saveAuthData(
    accessToken: string,
    refreshToken: string
  ): UserToken | null {
    try {
      const decoded = jwtDecode<DecodedToken>(accessToken);
      const userData: UserToken = {
        sub: decoded.sub,
        Role: decoded.Role,
      };

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userData", JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error("Error saving auth data:", error);
      this.clearAuthData();
      return null;
    }
  }
}

export default AuthUtils;
