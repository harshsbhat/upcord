import { signIn, organization } from "@/lib/auth-client"

export const handleGitHubSignIn = async () => { 
    await signIn.social({
      provider: 'github',
      callbackURL: '/',
    });
  };