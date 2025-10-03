// lib/auth.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabaseAdmin } from './supabaseAdmin';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Demo',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        // Minimal demo: accept any credentials; attach role from team_members
        const { data, error } = await supabaseAdmin
          .from('team_members')
          .select('email, role')
          .eq('email', credentials.email)
          .single();

        const role = data?.role || 'member';
        return { id: credentials.email, name: credentials.email, email: credentials.email, role };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role || 'member';
      else if (!token.role) token.role = 'member';
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role || 'member';
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};
