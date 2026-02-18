import {
  HeroSection,
  MetricsSection,
  PhilosophySection,
  RoadmapSection,
  CTASection,
} from '@/features/about';

export const metadata = {
  title: 'About Vyapar Sathi | Modern Retail ERP Solution',
  description:
    'Discover how Vyapar Sathi streamlines inventory management and POS operations for retail enterprises. Learn about our mission, features, and product roadmap.',
  keywords:
    'retail ERP, inventory management, POS system, point of sale, retail solution, Vyapar Sathi',
  canonical: 'https://vyapar-sathi.vercel.app/about',
  openGraph: {
    title: 'About Vyapar Sathi | Architecting the Future of Modern Retail Commerce',
    description:
      'Comprehensive ERP ecosystem engineered to streamline inventory management and point-of-sale operations for retail enterprises.',
    url: 'https://vyapar-sathi.vercel.app/about',
    type: 'website',
    images: [
      {
        url: 'https://vyapar-sathi.vercel.app/og-image-about.jpg',
        width: 1200,
        height: 630,
        alt: 'Vyapar Sathi - Modern Retail ERP Solution',
        type: 'image/jpeg',
      },
    ],
    siteName: 'Vyapar Sathi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Vyapar Sathi | Modern Retail ERP Solution',
    description:
      'Discover how Vyapar Sathi streamlines inventory management and POS operations for retail enterprises.',
    images: ['https://vyapar-sathi.vercel.app/og-image-about.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: 'https://vyapar-sathi.vercel.app/about',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen selection:bg-blue-100 selection:text-blue-600 font-sans">
      <HeroSection />
      <MetricsSection />
      <PhilosophySection />
      <RoadmapSection />
      <CTASection />
    </main>
  );
}