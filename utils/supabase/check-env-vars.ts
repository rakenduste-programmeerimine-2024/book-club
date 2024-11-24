export function checkEnvVars() {
    const requiredVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ];
  
    requiredVars.forEach((key) => {
      if (!process.env[key]) {
        throw new Error(`Environment variable ${key} is missing.`);
      }
    });
  }  