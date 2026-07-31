/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_P3D_RELEASE_PROFILE?: "development" | "public" | "paper" | "anonymous";
  readonly VITE_P3D_INCLUDE_LIVE?: "true" | "false";
  readonly VITE_P3D_SNAPSHOT_SHA256?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
