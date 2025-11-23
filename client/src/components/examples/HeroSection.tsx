import HeroSection from '../HeroSection';

export default function HeroSectionExample() {
  return (
    <HeroSection 
      address="174 Grande Pointe Cir, Rosemary Beach, FL 32461"
      bedrooms={4}
      bathrooms={4}
      squareFeet={2600}
      ctaUrl="https://calendly.com/kaci-wolkers"
    />
  );
}
