
import CredentialsProvider from 'next-auth/providers/credentials';
export const authOptions = {
  providers: [CredentialsProvider({
    name: 'Credentials',
    credentials: { email: { label: 'Email', type: 'text' }, password: { label: 'Password', type: 'password' } },
    async authorize(credentials) {
      const { email, password } = credentials ?? {};
      if (!email || !password) return null;
      return { id: 'user-1', name: 'Admin', email };
    }
  })],
  session: { strategy: 'jwt' }
};
