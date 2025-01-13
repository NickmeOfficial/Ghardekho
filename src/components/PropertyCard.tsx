import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../types/property';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Maximize } from 'lucide-react';

interface PropertyCardProps {
    property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const formatPrice = (price: string) => {
        const numPrice = parseInt(price.replace(/,/g, ''), 10);
        if (isNaN(numPrice)) {
            return 'Price not available';
        }

        if (numPrice >= 10000000) {
            return `₹${(numPrice / 10000000).toFixed(2)} Cr`;
        } else if (numPrice >= 100000) {
            return `₹${(numPrice / 100000).toFixed(2)} Lac`;
        } else {
            return `₹${numPrice.toLocaleString()}`;
        }
    };

    return (
        <Card className='overflow-hidden group w-72'>
            <div className='relative'>
                <div className='absolute top-2 left-2 z-10'>
                    <Badge className='bg-yellow-400 text-yellow-800 text-xs px-2 py-1'>
                        {property.property_type}
                    </Badge>
                </div>
                <img
                    src='/placeholder.svg?height=200&width=300'
                    alt={property.title}
                    className='w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300'
                />
            </div>
            <CardContent className='p-2'>
                <h3 className='text-sm font-semibold mb-1'>{property.title}</h3>
                <p className='text-xs text-gray-500 mb-2'>
                    {property.description.length > 60
                        ? property.description.substring(0, 57) + '...'
                        : property.description}
                </p>
                <div className='grid grid-cols-3 gap-2 text-xs'>
                    <div className='flex items-center gap-1'>
                        <Badge
                            className={`${
                                property.status === 'SOLD'
                                    ? 'bg-red-500 text-white'
                                    : property.status === 'ACTIVE'
                                     ? 'bg-green-500 text-white'
                                     :'bg-yellow-400 text-yellow-800'
                            } text-xs px-2 py-1`}
                        >
                            {property.status}
                        </Badge>
                    </div>
                    <div className='flex items-center gap-1'>
                        <Maximize className='w-3 h-3' />
                        <span>{property.area}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className='p-4 flex items-center justify-between border-t'>
                <div>
                    <span className='text-sm font-bold'>
                        {formatPrice(property.price)}
                    </span>
                </div>
                <Link
                    to={`/property/${property.property_id}`}
                    className='text-sm font-medium text-yellow-600 hover:text-yellow-700 flex items-center'
                >
                    View Details
                    <span className='ml-1'>→</span>
                </Link>
            </CardFooter>
        </Card>
    );
};
