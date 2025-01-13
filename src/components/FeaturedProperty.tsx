import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "./ui/button";

export const FeaturedProperty: React.FC = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-8">Featured Property</h2>
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div>
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Luxury Villa"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="mt-8 lg:mt-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Luxury Villa in Goa</h3>
            <p className="text-gray-600 mb-6">
              Breathtaking city views, private amenities, and state-of-the-art features, this property offers an unparalleled luxury lifestyle.
            </p>
            <ul className="text-gray-600 mb-8">
              <li>5 Bedrooms</li>
              <li>6 Bathrooms</li>
              <li>7,500 sq ft</li>
              <li>Private Pool and Spa</li>
              <li>Home Theater</li>
              <li>Wine Cellar</li>
            </ul>
            <Button asChild>
              <Link to="/property/featured">View Details</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

