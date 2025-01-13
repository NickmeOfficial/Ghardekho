import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { PropertyGrid } from '../components/PropertyGrid';
import { Button } from "../components/ui/button";
import { Building2, MapPin,  Clock } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <main>
      <HeroSection />
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose GharDekho?</h2>
          <div className="grid md:grid-cols-3 gap-8 ">
            <div className="text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="font-semibold mb-2">Verified Properties</h3>
              <p className="text-gray-600">All listings are thoroughly verified by agent</p>
            </div>
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="font-semibold mb-2">Prime Locations</h3>
              <p className="text-gray-600">Properties in the most sought-after locations</p>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="font-semibold mb-2">Timely Updates</h3>
              <p className="text-gray-600">Regular updates on property status</p>
            </div>
          </div>
        </div>
      </section>

      <PropertyGrid />
      <section className="py-16 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
          <p className="text-gray-600 mb-8">Thousands of people are already searching for their perfect property on GharDekho!</p>
          <Button asChild size="lg">
            <a href="/properties">Browse Properties</a>
          </Button>
        </div>
      </section>
    </main>
  );
};

