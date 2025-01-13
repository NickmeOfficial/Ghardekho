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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '../components/ui/dialog';
import ModernCard from '../components/ModernCard';

interface Notification {
    message: string;
    type: 'success' | 'error';
}

export const PropertyDashboard: React.FC = () => {
    const { properties, fetchPropertyList, updateProperty, deleteProperty, createProperty } = usePropertyContext();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('');
    const [selectedProperty, setSelectedProperty] = useState<PropertyDetails | null>(null);
    const [displayedProperties, setDisplayedProperties] = useState<PropertyDetails[]>([]);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: number; title: string } | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProperty, setNewProperty] = useState<Omit<PropertyDetails, 'id'>>({
        title: '',
        description: '',
        created_by: '',
        price: 0,
        currency: 'USD',
        email: '',
        mobile: '',
        property_type: '',
        area: '',
        measurement_type: 1,
        is_featured: false,
        status: 'ACTIVE'
    });

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

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
            showNotification("Invalid property ID", "error");
            return;
        }

        try {
            await updateProperty(updatedProperty.id, updatedProperty);
            showNotification('Property updated successfully', 'success');
            setSelectedProperty(null);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            showNotification(`Failed to update property: ${errorMessage}`, 'error');
        }
    };

    const handlePropertyDelete = async (id: number | undefined) => {
        if (!id) {
            showNotification('Cannot delete property: Invalid ID', 'error');
            return;
        }

        const propertyToDelete = displayedProperties.find(p => p.id === id);
        if (!propertyToDelete) {
            showNotification('Cannot delete property: Property not found', 'error');
            return;
        }

        setDeleteConfirmation({ id, title: propertyToDelete.title });
    };

    const confirmDelete = async () => {
        if (!deleteConfirmation) return;

        try {
            await deleteProperty(deleteConfirmation.id);
            showNotification('Property deleted successfully', 'success');
        } catch (error) {
            showNotification('Failed to delete property. Please try again.', 'error');
        } finally {
            setDeleteConfirmation(null);
        }
    };

    const handleCreateProperty = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createProperty(newProperty);
            showNotification('Property created successfully', 'success');
            setShowAddForm(false);
            setNewProperty({
                title: '',
                description: '',
                created_by: '',
                price: 0,
                currency: 'USD',
                email: '',
                mobile: '',
                property_type: '',
                area: '',
                measurement_type: 1,
                is_featured: false,
                status: 'ACTIVE'
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            showNotification(`Failed to create property: ${errorMessage}`, 'error');
        }
    };

    return (
        <div className='p-8 relative'>
            {notification && (
                <div
                    className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 transition-opacity duration-300 ${
                        notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                    } text-white`}
                >
                    {notification.message}
                </div>
            )}
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-bold'>Property Dashboard</h1>
                <Button onClick={() => setShowAddForm(true)}>Add Property</Button>
            </div>
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
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {displayedProperties.map((property) => (
                    <ModernCard
                        key={property.id}
                        title={property.title}
                        subtitle={`${property.price} ${property.currency}`}
                        description={`${property.area} | ${property.property_type || 'N/A'} | ${property.status || 'N/A'}`}
                        onEdit={() => handleEditProperty(property)}
                        onDelete={() => {
                            if (property?.id) {
                                handlePropertyDelete(property.id);
                            } else {
                                showNotification('Invalid property data', 'error');
                            }
                        }}
                    />
                ))}
            </div>
            <Dialog
                open={!!selectedProperty}
                onOpenChange={() => setSelectedProperty(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Property</DialogTitle>
                        <DialogDescription>
                            Make changes to your property details here. Click update when you're done.
                        </DialogDescription>
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
                                <Label htmlFor="property-title">Title</Label>
                                <Input
                                    id="property-title"
                                    name="title"
                                    autoComplete="off"
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
                                <Label htmlFor="property-description">Description</Label>
                                <Input
                                    id="property-description"
                                    name="description"
                                    autoComplete="off"
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
                                <Label htmlFor="property-created-by">Created By</Label>
                                <Input
                                    id="property-created-by"
                                    name="created_by"
                                    autoComplete="name"
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
                                <Label htmlFor="property-price">Price</Label>
                                <Input
                                    id="property-price"
                                    name="price"
                                    type="number"
                                    autoComplete="off"
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
                                <Label htmlFor="property-currency">Currency</Label>
                                <Select
                                    name="currency"
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
                                    <SelectTrigger id="property-currency" className='w-full'>
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
                                <Label htmlFor="property-email">Email</Label>
                                <Input
                                    id="property-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
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
                                <Label htmlFor="property-mobile">Mobile</Label>
                                <Input
                                    id="property-mobile"
                                    name="mobile"
                                    type="tel"
                                    autoComplete="tel"
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
                                <Label htmlFor="property-type">Property Type</Label>
                                <Select
                                    name="property_type"
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
                                    <SelectTrigger id="property-type" className='w-full'>
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
                                <Label htmlFor="property-area">Area</Label>
                                <Input
                                    id="property-area"
                                    name="area"
                                    autoComplete="off"
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
                                <Label htmlFor="property-measurement-type">Measurement Type</Label>
                                <Input
                                    id="property-measurement-type"
                                    name="measurement_type"
                                    autoComplete="off"
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
                                <Label htmlFor="property-status">Status</Label>
                                <Input
                                    id="property-status"
                                    name="status"
                                    autoComplete="off"
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
                                id="property-featured"
                                name="is_featured"
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
                            <Label htmlFor="property-featured">Featured</Label>
                        </div>
                        <DialogFooter>
                            <Button type='submit'>Update Property</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{deleteConfirmation?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteConfirmation(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            Delete Property
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Property</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new property.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateProperty} className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor="new-property-title">Title</Label>
                                <Input
                                    id="new-property-title"
                                    value={newProperty.title}
                                    onChange={(e) => setNewProperty(prev => ({
                                        ...prev,
                                        title: e.target.value
                                    }))}
                                    required
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="new-property-description">Description</Label>
                                <Input
                                    id="new-property-description"
                                    value={newProperty.description}
                                    onChange={(e) => setNewProperty(prev => ({
                                        ...prev,
                                        description: e.target.value
                                    }))}
                                    required
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="new-property-created-by">Created By</Label>
                                <Input
                                    id="new-property-created-by"
                                    value={newProperty.created_by}
                                    onChange={(e) => setNewProperty(prev => ({
                                        ...prev,
                                        created_by: e.target.value
                                    }))}
                                    required
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="new-property-price">Price</Label>
                                <Input
                                    id="new-property-price"
                                    type="number"
                                    value={newProperty.price}
                                    onChange={(e) => setNewProperty(prev => ({
                                        ...prev,
                                        price: Number(e.target.value)
                                    }))}
                                    required
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="new-property-currency">Currency</Label>
                                <Select
                                    value={newProperty.currency}
                                    onValueChange={(value) => setNewProperty(prev => ({
                                        ...prev,
                                        currency: value
                                    }))}
                                >
                                    <SelectTrigger id="new-property-currency" className='w-full'>
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
                                <Label htmlFor="new-property-email">Email</Label>
                                <Input
                                    id="new-property-email"
                                    type="email"
                                    value={newProperty.email}
                                    onChange={(e) => setNewProperty(prev => ({
                                        ...prev,
                                        email: e.target.value
                                    }))}
                                    required
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="new-property-mobile">Mobile</Label>
                                <Input
                                    id="new-property-mobile"
                                    type="tel"
                                    value={newProperty.mobile}
                                    onChange={(e) => setNewProperty(prev => ({
                                        ...prev,
                                        mobile: e.target.value
                                    }))}
                                    required
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="new-property-type">Property Type</Label>
                                <Select
                                    value={newProperty.property_type}
                                    onValueChange={(value) => setNewProperty(prev => ({
                                        ...prev,
                                        property_type: value
                                    }))}
                                >
                                    <SelectTrigger id="new-property-type" className='w-full'>
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
                                <Label htmlFor="new-property-area">Area</Label>
                                <Input
                                    id="new-property-area"
                                    value={newProperty.area}
                                    onChange={(e) => setNewProperty(prev => ({
                                        ...prev,
                                        area: e.target.value
                                    }))}
                                    required
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="new-property-measurement-type">Measurement Type</Label>
                                <Input
                                    id="new-property-measurement-type"
                                    value={newProperty.measurement_type}
                                    onChange={(e) => setNewProperty(prev => ({
                                        ...prev,
                                        measurement_type: parseInt(e.target.value, 10)
                                    }))}
                                    required
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="new-property-status">Status</Label>
                                <Input
                                    id="new-property-status"
                                    value={newProperty.status}
                                    onChange={(e) => setNewProperty(prev => ({
                                        ...prev,
                                        status: e.target.value
                                    }))}
                                    required
                                />
                            </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Checkbox
                                id="new-property-featured"
                                checked={newProperty.is_featured}
                                onCheckedChange={(checked) => setNewProperty(prev => ({
                                    ...prev,
                                    is_featured: checked as boolean
                                }))}
                            />
                            <Label htmlFor="new-property-featured">Featured</Label>
                        </div>
                        <DialogFooter>
                            <Button type='submit'>Create Property</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
