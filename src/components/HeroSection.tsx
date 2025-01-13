import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

export const HeroSection: React.FC = () => {
    return (
        <section className='relative h-[600px] flex items-center justify-center'>
            <div className='absolute inset-0 bg-gray-900/60 z-10' />
            <div
                className='absolute inset-0 bg-cover bg-center'
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                }}
            />
            <div className='relative z-20 text-center text-white max-w-3xl mx-auto px-4'>
                <h1 className='text-4xl md:text-6xl font-bold mb-6'>
                    Find Your Dream Home in Goa
                </h1>
                <p className='text-lg md:text-xl mb-8'>
                    Discover the perfect property across major cities in Goa.
                    From luxurious beachside villas to cozy homes, find it all
                    on GharDekho..
                </p>
                <div className='flex flex-col md:flex-row gap-4 max-w-2xl mx-auto'>
                    <Input
                        placeholder='Where’s your dream spot? Type it here!'
                        className='bg-white text-gray-900'
                    />
                    <Button size='lg' className='md:w-auto'>
                        <Search className='w-4 h-4 mr-2' />
                        Search
                    </Button>
                </div>
            </div>
        </section>
    );
};
