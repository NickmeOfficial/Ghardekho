import React from 'react';
import { PropertyCard } from './PropertyCard';
import { usePropertyContext } from '../contexts/PropertyContext';

export const PropertyGrid: React.FC = () => {
  const { properties, loading, error } = usePropertyContext();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="py-16 px-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {properties.map(property => (
          <PropertyCard key={property.property_id} property={property} />
        ))}
      </div>
    </section>
  );
};
