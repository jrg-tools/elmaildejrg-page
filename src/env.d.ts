/// <reference types="astro/client" />
/// <reference types="astro-clerk-auth/env" />

interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
