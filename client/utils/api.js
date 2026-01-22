import axios from "axios";

const baseURL = "https://my-first-react-stack-production.up.railway.app/api";
export const api = axios.create({
  baseURL,
  withCredentials: true,
});

let accessToken = null;
export function setAccessToken(t) {
  accessToken = t;
  if (t) api.defaults.headers.common.Authorization = `Bearer ${t}`;
  else delete api.defaults.headers.common.Authorization;
}

let refreshing = null;
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const original = err.config;
    // if refresh itself failed, don't loop
    if (original?.url?.includes("/auth/refresh")) throw err;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      refreshing =
        refreshing ||
        api
          .post("/auth/refresh")
          .then((r) => {
            setAccessToken(r.data.accessToken);
            return r.data.accessToken;
          })
          .finally(() => (refreshing = null));
      await refreshing;
      return api(original);
    }
    throw err;
  }
);
