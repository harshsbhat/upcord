import { authClient } from "@/lib/auth-client"

export const handleGitHubSignIn = async () => { 
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/onboarding',
    });
};

export const handleGoogleSignIn = async () => { 
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/onboarding',
    });
};
