import { Hero } from '@/components/home/Hero';
import { About } from '@/components/home/About';
import { Founder } from '@/components/home/Founder';
import { Story } from '@/components/home/Story';
import { Why } from '@/components/home/Why';
import { WhatWeDo } from '@/components/home/WhatWeDo';
import { Impact } from '@/components/home/Impact';
import { Ways } from '@/components/home/Ways';
import { Journey } from '@/components/home/Journey';
import { GallerySection } from '@/components/home/GallerySection';
import { Donate } from '@/components/home/Donate';
import { Contact } from '@/components/home/Contact';
import { CTA } from '@/components/home/CTA';
import { HomeClient } from '@/components/home/HomeClient';

export default function HomePage() {
  return (
    <main id="main">
      <Hero /><About /><Founder /><Story /><Why /><WhatWeDo /><Impact /><Ways /><Journey /><GallerySection /><Donate /><Contact /><CTA />
      <HomeClient />
    </main>
  );
}
