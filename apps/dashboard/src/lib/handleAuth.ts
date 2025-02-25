import { signIn } from "@/lib/auth-client"

export const handleGitHubSignIn = async () => { 
    await signIn.social({
      provider: 'github',
      callbackURL: '/',
    });
};

export const handleGoogleSignin = async () => { 
    await signIn.social({
      provider: 'google',
      callbackURL: '/',
    });
};