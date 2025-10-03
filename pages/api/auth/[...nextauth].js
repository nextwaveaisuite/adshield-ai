import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AzureADProvider from 'next-auth/providers/azure-ad';

export default NextAuth({
  providers: [
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }) : null,
    process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET ? AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID || 'common'
    }) : null
  ].filter(Boolean),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session }){
      // pass through the email so RBAC can use it
      return session;
    }
  }
});