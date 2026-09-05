export const siteConfig = {
  name: 'Cinevin',
  description: 'Watch movies and TV shows online. Stream the latest releases, classics, and more.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: 'https://cinevin.vercel.app/og.jpg',
  links: {
    github: 'https://github.com/yourusername/cinevin',
  },
} as const