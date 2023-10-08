// components/LinkedInLoginButton.tsx
import { signIn } from 'next-auth/react';

export const LinkedInLoginButton = () => {
  const handleLogin = () => {
    signIn('linkedin'); // 'linkedin' should match the provider name in [...nextauth].ts
  };

  return (
    <button onClick={handleLogin}>
      Connect with LinkedIn
    </button>
  );
};

export default LinkedInLoginButton;
