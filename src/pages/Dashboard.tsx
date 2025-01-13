import { useState, useEffect } from 'react';
import { usePropertyContext } from '../contexts/PropertyContext';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { PropertyDetails } from '../types/property';
import { Input } from '../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import { Card, CardContent } from '../components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../components/ui/dialog';


export const PropertyDashboard: React.FC = () => {
    const { properties, fetchPropertyList, updateProperty, deleteProperty } = usePropertyContext();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('');
    const [selectedProperty, setSelectedProperty] = useState<PropertyDetails | null>(null);
    const [displayedProperties, setDisplayedProperties] = useState<PropertyDetails[]>([]);

    useEffect(() => {
        const loadProperties = async () => {
            await fetchPropertyList(searchTerm);
        };

        const debounceTimer = setTimeout(loadProperties, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm, fetchPropertyList]);

    useEffect(() => {
        setDisplayedProperties(properties);
    }, [properties]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

    const handleSort = (value: string) => {
        setSortOption(value);
        const sortedProperties = [...displayedProperties].sort((a, b) => {
            if (value === 'price') return a.price - b.price;
            if (value === 'area') return parseFloat(a.area) - parseFloat(b.area);
            return a.title.localeCompare(b.title);
        });
        setDisplayedProperties(sortedProperties);
    };

    const handleEditProperty = (property: PropertyDetails) => setSelectedProperty(property);

    const handlePropertyUpdate = async (updatedProperty: PropertyDetails) => {
        if (!updatedProperty.id) {
            console.error("Invalid propertyId:", updatedProperty.id);
            return;
        }

        try {
            await updateProperty(updatedProperty.id, updatedProperty);
            alert('Property updated successfully.');
            setSelectedProperty(null);
        } catch (error) {
            console.error("Failed to update property:", error);
            if (error instanceof Error) {
                alert(`Failed to update property: ${error.message}`);
            } else {
                alert('Failed to update property. Please try again.');
            }
        }
    };

    const handlePropertyDelete = async (id: number | undefined) => {
        if (!id) {
            console.error("Property ID is missing");
            alert('Cannot delete property: Invalid ID');
            return;
        }

        const propertyToDelete = displayedProperties.find(p => p.id === id);
        if (!propertyToDelete) {
            console.error("Property not found with ID:", id);
            alert('Cannot delete property: Property not found');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete "${propertyToDelete.title}"?`)) {
            return;
        }

        try {
            await deleteProperty(id);
            alert('Property deleted successfully.');
        } catch (error) {
            console.error("Failed to delete property:", error);
            alert('Failed to delete property. Please try again.');
        }
    };

    return (
        <div className='p-8'>
            <h1 className='text-3xl font-bold mb-6'>Property Dashboard</h1>
            <div className='flex gap-4 mb-6'>
                <Input
                    type='text'
                    placeholder='Search properties...'
                    value={searchTerm}
                    onChange={handleSearch}
                    className='flex-grow'
                />
                <Select onValueChange={handleSort} value={sortOption}>
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Sort by' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='title'>Sort by Title</SelectItem>
                        <SelectItem value='price'>Sort by Price</SelectItem>
                        <SelectItem value='area'>Sort by Area</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {displayedProperties.map((property) => (
                    <Card key={property.id}>
                        <CardContent className='p-6'>
                            <h2 className='text-xl font-semibold mb-2'>
                                {property.title}
                            </h2>
                            <p className='text-lg font-bold mb-2'>
                                {property.price} {property.currency}
                            </p>
                            <p className='text-gray-600 mb-4'>
                                {property.area}
                            </p>
                            <div className='flex justify-between'>
                                <Button
                                    onClick={() => handleEditProperty(property)}
                                    variant='outline'
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (property && property.id) {
                                            console.log("Delete button clicked for property:", property);
                                            handlePropertyDelete(property.id);
                                        } else {
                                            console.error("Invalid property data:", property);
                                        }
                                    }}
                                    variant='destructive'
                                >
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Dialog
                open={!!selectedProperty}
                onOpenChange={() => setSelectedProperty(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Property</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (selectedProperty) handlePropertyUpdate(selectedProperty);
                        }}
                        className='space-y-4'
                    >
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='title'>Title</Label>
                                <Input
                                    id='title'
                                    value={selectedProperty?.title || ''}
                                    onChange={(e) =>
                                        setSelectedProperty(
                                            selectedProperty
                                                ? {
                                                      ...selectedProperty,
                                                      title: e.target.value,
                                                  }
                                                : null
                                        )
                                    }
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='description'>Description</Label>
                                <Input
                                    id='description'
                                    value={selectedProperty?.description || ''}
                                    onChange={(e) =>
                                        setSelectedProperty(
                                            selectedProperty
                                                ? {
                                                      ...selectedProperty,
                                                      description: e.target.value,
                                                  }
                                                : null
                                        )
                                    }
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='created_by'>Created By</Label>
                                <Input
                                    id='created_by'
                                    value={selectedProperty?.created_by || ''}
                                    onChange={(e) =>
                                        setSelectedProperty(
                                            selectedProperty
                                                ? {
                                                      ...selectedProperty,
                                                      created_by: e.target.value,
                                                  }
                                                : null
                                        )
                                    }
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='price'>Price</Label>
                                <Input
                                    id='price'
                                    type="number"
                                    value={selectedProperty?.price || ''}
                                    onChange={(e) =>
                                        setSelectedProperty(
                                            selectedProperty
                                                ? {
                                                      ...selectedProperty,
                                                      price: Number(e.target.value),
                                                  }
                                                : null
                                        )
                                    }
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='currency'>Currency</Label>
                                <Select
                                    onValueChange={(value) =>
                                        setSelectedProperty(
                                            selectedProperty
                                                ? {
                                                      ...selectedProperty,
                                                      currency: value,
                                                  }
                                                : null
                                        )
                                    }
                                    value={selectedProperty?.currency || ''}
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select currency' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='USD'>USD</SelectItem>
                                        <SelectItem value='INR'>INR</SelectItem>
                                        <SelectItem value='POUND'>POUND</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='email'>Email</Label>
                                <Input
                                    id='email'
                                    value={selectedProperty?.email || ''}
                                    onChange={(e) =>
                                        setSelectedProperty(
                                            selectedProperty
                                                ? {
                                                      ...selectedProperty,
                                                      email: e.target.value,
                                                  }
                                                : null
                                        )
                                    }
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='mobile'>Mobile</Label>
                                <Input
                                    id='mobile'
                                    value={selectedProperty?.mobile || ''}
                                    onChange={(e) =>
                                        setSelectedProperty(
                                            selectedProperty
                                                ? {
                                                      ...selectedProperty,
                                                      mobile: e.target.value,
                                                  }
                                                : null
                                        )
                                    }
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='property_type'>Property Type</Label>
                                <Select
                                    onValueChange={(value) =>
                                        setSelectedProperty(
                                            selectedProperty
                                                ? {
                                                      ...selectedProperty,
                                                      property_type: value,
                                                  }
                                                : null
                                        )
                                    }
                                    value={selectedProperty?.property_type || ''}
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select property type' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='Apartment'>Apartment</SelectItem>
                                        <SelectItem value='House'>House</SelectItem>
                                        <SelectItem value='Condo'>Condo</SelectItem>
                                        <SelectItem value='Land'>Land</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='area'>Area</Label>
                                <Input
                                    id='area'
                                    value={selectedProperty?.area || ''}
                                    onChange={(e) =>
                                        setSelectedProperty(
                                            selectedProperty
                                                ? {
                                                      ...selectedProperty,
                                                      area: e.target.value,
                                                  }
                                                : null
                                        )
                                    }
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='measurement_type'>Measurement Type</Label>
                                <Input
                                    id='measurement_type'
                                    value={selectedProperty?.measurement_type || ''}
                                    onChange={(e) =>
                                        setSelectedProperty(
                                            selectedProperty
                                                ? {
                                                      ...selectedProperty,
                                                      measurement_type: parseInt(e.target.value, 10),
                                                  }
                                                : null
                                        )
                                    }
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='status'>Status</Label>
                                <Input
                                    id='status'
                                    value={selectedProperty?.status || ''}
                                    onChange={(e) =>
                                        setSelectedProperty(
                                            selectedProperty
                                                ? {
                                                      ...selectedProperty,
                                                      status: e.target.value,
                                                  }
                                                : null
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Checkbox
                                id='is_featured'
                                checked={selectedProperty?.is_featured || false}
                                onCheckedChange={(checked) =>
                                    setSelectedProperty(
                                        selectedProperty
                                            ? {
                                                  ...selectedProperty,
                                                  is_featured: checked as boolean,
                                              }
                                            : null
                                    )
                                }
                            />
                            <Label htmlFor='is_featured'>Featured</Label>
                        </div>
                        <DialogFooter>
                            <Button type='submit'>Update Property</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
