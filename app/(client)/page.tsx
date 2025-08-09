import HeroSection from '@/components/client/home/hero-section'
import ProductCategories from '@/components/client/home/product-categories'
import BrandsSection from '@/components/client/home/brands-section'
import AboutSection from '@/components/client/home/about-section'
import ContactSection from '@/components/client/home/contact-section'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        {/*<HeroSection />*/}
        <ProductCategories />
        <BrandsSection />
        <AboutSection />
        <ContactSection />
      </main>
    </div>
  )
}
