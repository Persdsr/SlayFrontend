import axios from "axios"

// ----------------------------------------------------------------------

const fetcher = axios.create({
    baseURL: "http://localhost:8080/api/auth",
    headers: {
        Authorization: `Bearer ${getAuthAccessToken()}`,
    },
});

fetcher.interceptors.response.use(
    (successRes) => successRes,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && error.config && originalRequest._isRetry !== true) {
            console.log("Не авторизован");
            originalRequest._isRetry = true;
        }
        throw error;
    },
);

export default fetcher;


export const setAuthTokens = (accessToken) => {
    if (accessToken === null) {
        fetcher.defaults.headers.Authorization = "";
        //
        localStorage.removeItem("accessToken");
        // localStorage.removeItem("refreshToken");
    } else {
        fetcher.defaults.headers.Authorization = `Bearer ${accessToken}`;
        //
        localStorage.setItem("accessToken", accessToken);
        // localStorage.setItem("refreshToken", refreshToken);
    }
};

export const resetAuthTokens = () => setAuthTokens(null);

export function getAuthAccessToken() {
    return localStorage.getItem("accessToken");
}

/*export function getAuthRefreshToken() {
    return localStorage.getItem("refreshToken");
}*/
