import HeroSection from '../HeroSection';

export default function HeroSectionExample() {
  return (
    <HeroSection 
      totalRaised="R 24,360.50" 
      donorCount={30} 
      impactMetric="25+" 
    />
  );
}