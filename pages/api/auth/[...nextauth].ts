// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import LinkedInProvider from "next-auth/providers/linkedin";

export default NextAuth({
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  ],
  // Add any additional NextAuth configuration here
});
