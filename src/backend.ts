export type BackendEnvironment = "development" | "production";

// Change to "development" only when testing against the local FastAPI server.
const BACKEND_ENVIRONMENT: BackendEnvironment = "production";

const BACKEND_URLS: Record<BackendEnvironment, string> = {
    development: "http://localhost:8000",
    production: "https://cortexbackend.onrender.com"
};

export const CHAT_ENDPOINT =
    `${BACKEND_URLS[BACKEND_ENVIRONMENT]}/chat`;
