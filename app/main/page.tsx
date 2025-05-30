import HeroSection from '../components/HeroSection';
import ProcessSteps from '../components/ProcessSteps';
import InternalLinks from '../components/InternalLinks';
import ValueProps from '../components/ValueProps';
import Stats from '../components/Stats';
import CallToAction from '../components/CallToAction';
import FABSpeedDial from '../components/FABSpeedDial';
import Footer from '../components/Footer';
import MainClientContent from './MainClientContent';

export default function Main() {
  return (
    <>
      <HeroSection />
      <ProcessSteps />
      <InternalLinks />
      <ValueProps />
      <MainClientContent />
      <CallToAction />
      <FABSpeedDial />
    </>
  );
} 