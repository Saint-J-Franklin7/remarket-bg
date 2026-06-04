import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Ajouter ici les domaines CDN des photos produits quand elles seront hébergées
      // Exemple: { hostname: 'res.cloudinary.com' }
    ],
  },
};

export default nextConfig;
