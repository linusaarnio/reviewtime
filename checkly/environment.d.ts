declare global {
    namespace NodeJS {
      interface ProcessEnv {
        GITHUB_USER: string;
        GITHUB_PW: string;
        GITHUB_OTP_SECRET: string;
        REVIEWTIME_FRONTEND_URL: string;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {};
  