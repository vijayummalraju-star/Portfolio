import Hero from '../components/Hero';
import About from '../components/About';
import ToolsUniverse from '../components/ToolsUniverse';
import Journey from '../components/Journey';
import GithubSpotlight from '../components/GithubSpotlight';
import RealTimeProjectInterface from '../components/RealTimeProjectInterface';
import ProjectsGallery from '../components/ProjectsGallery';
import Voices from '../components/Testimonials';
import FinalPersonalSection from '../components/FinalPersonalSection';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="bg-black text-[#f5f1e8]">
      <Hero />
      <About />
      <ToolsUniverse />
      <Journey />
      <GithubSpotlight />
      <RealTimeProjectInterface />
      <ProjectsGallery />
      <Voices />
      <FinalPersonalSection />
      <Contact />
      <Footer />
    </main>
  );
}
