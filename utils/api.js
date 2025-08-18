import axios from "axios";

export const api = axios.create({
    baseURL: "/api",
    withCredentials: true, // important. needed to send/receive the HTTP-only cookie
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
    async(err) => {
        const original = err.config;
        if(err.response?.status === 401 && !original._retry) {
            original._retry = true;
            refreshing ||
            api.post("/auth/refresh").then((r) => {
                setAccessToken(r.data.accessToken);
                return r.data.accessToken;
            }).finally(() => (refreshing = null));
            await refreshing;
            return api( original );
        }
        throw err;
    }
);


