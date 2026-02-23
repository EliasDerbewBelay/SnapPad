import api from "./axios";

export const authService = {
  async register(data: any) {
    const response = await api.post("account/register/", data);
    return response.data;
  },

  async login(credentials: any) {
    const response = await api.post("account/login/", credentials);
    if (response.data.access) {
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
};
