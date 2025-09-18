/// <reference types="vite/client" />
declare const BUILD_VERSION: string;
declare const BUILD_DATE: string;
declare const RESOURCES_URL: string;
declare const API_URL: string;

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MESSAGE_SENDER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
