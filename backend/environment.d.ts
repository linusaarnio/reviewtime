declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_APP_ID: string;
      GITHUB_APP_PRIVATE_KEY: string;
      GITHUB_APP_OAUTH_CLIENT_ID: string;
      GITHUB_APP_OAUTH_CLIENT_SECRET: string;
      GITHUB_APP_WEBHOOK_SECRET: string;
      SESSION_COOKIE_SECRET: string;
      SECURE_SESSION_COOKIE: 'true' | 'false';
      TRUST_PROXY_SESSION_COOKIE: 'true' | 'false';
      REVIEWTIME_API_PORT: string;
      DATABASE_URL: string;
      SENDGRID_API_KEY: string;
      SENDGRID_VERIFIED_FROM_EMAIL: string;
      CREATE_OPENAPI_FILE: 'true' | 'false';
      REVIEW_DUE_AFTER_MINUTES: string;
      FRONTEND_URL: string;
      npm_package_version: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
