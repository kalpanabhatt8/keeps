/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_YT_API_KEY: string;
    // add more env vars here if needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }