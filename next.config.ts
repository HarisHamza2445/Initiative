import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Old prototype links used hash routes (#gallery, #volunteer …). Real routes now live at /gallery etc.
  // Hash fragments never reach the server, so the client-side redirect is in components/layout/LegacyHashRedirect.tsx.
  poweredByHeader: false,
};

export default nextConfig;
