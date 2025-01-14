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
    const { 
        properties, 
        fetchPropertyList, 
        updateProperty, 
        deleteProperty, 
        createProperty,
        totalPages,    // Add these from context
        currentPage,   // Add these from context
        setCurrentPage // Add these from context
    } = usePropertyContext();
    
    // Remove these as they're now coming from context
    // const [currentPage, setCurrentPage] = useState(1);
    // const [totalPages, setTotalPages] = useState(1);

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
        currency: 'INR', // Set default currency to INR
        email: '',
        mobile: '',
        property_type: '',
        area: '',
        measurement_type: 1,
        is_featured: false,
        status: 'ACTIVE' // Set default status to ACTIVE
    });

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        setDisplayedProperties(properties);
    }, [properties]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
    };

    const handleSearchSubmit = async () => {
        try {
            setCurrentPage(1); // Reset to first page on new search
            await fetchPropertyList(searchTerm, 1); // Always start from page 1 for new search
        } catch (error) {
            showNotification('Failed to search properties', 'error');
        }
    };

    useEffect(() => {
        fetchPropertyList('', currentPage);
    }, []); // Run only once on mount

    const handleSort = (value: string) => {
        setSortOption(value);
        const sortedProperties = [...displayedProperties].sort((a, b) => {
            try {
                switch (value) {
                    case 'price-low':
                        return Number(a.price || 0) - Number(b.price || 0);
                    case 'price-high':
                        return Number(b.price || 0) - Number(a.price || 0);
                    case 'area-low':
                        // Remove non-numeric characters and convert to number
                        const areaA = parseFloat(a.area.replace(/[^0-9.]/g, '') || '0');
                        const areaB = parseFloat(b.area.replace(/[^0-9.]/g, '') || '0');
                        return areaA - areaB;
                    case 'area-high':
                        const areaC = parseFloat(a.area.replace(/[^0-9.]/g, '') || '0');
                        const areaD = parseFloat(b.area.replace(/[^0-9.]/g, '') || '0');
                        return areaD - areaC;
                    case 'title-asc':
                        return (a.title || '').localeCompare(b.title || '');
                    case 'title-desc':
                        return (b.title || '').localeCompare(a.title || '');
                    case 'latest':
                        return (Number(b.id) || 0) - (Number(a.id) || 0);
                    case 'oldest':
                        return (Number(a.id) || 0) - (Number(b.id) || 0);
                    default:
                        return 0;
                }
            } catch (error) {
                console.error('Sorting error:', error);
                return 0;
            }
        });
        setDisplayedProperties(sortedProperties);
    };

    useEffect(() => {
        if (sortOption) {
            handleSort(sortOption);
        } else {
            setDisplayedProperties(properties);
        }
    }, [properties]);

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
                currency: 'INR', 
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

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchPropertyList(searchTerm, nextPage);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            fetchPropertyList(searchTerm, prevPage);
        }
    };

    return (
        <div className='p-4 sm:p-6 md:p-8 relative'>
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 transition-opacity duration-300 ${
                    notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                } text-white max-w-[90vw] md:max-w-md`}>
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
                <h1 className='text-2xl sm:text-3xl font-bold'>Property Dashboard</h1>
                <Button onClick={() => setShowAddForm(true)}>Add Property</Button>
            </div>

            {/* Search and Sort */}
            <div className='flex flex-col sm:flex-row gap-4 mb-6'>
                <div className='flex-grow flex gap-2 w-full sm:w-auto'>
                    <Input
                        type='text'
                        placeholder='Search properties...'
                        value={searchTerm}
                        onChange={handleSearch}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearchSubmit();
                            }
                        }}
                        className="flex-1"
                    />
                    <Button 
                        onClick={handleSearchSubmit}
                        variant="default"
                        className="bg-primary hover:bg-primary/90 whitespace-nowrap"
                    >
                        Search
                    </Button>
                </div>
                <Select onValueChange={handleSort} value={sortOption}>
                    <SelectTrigger className='w-full sm:w-[180px]'>
                        <SelectValue placeholder='Sort by' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='latest'>Latest First</SelectItem>
                        <SelectItem value='oldest'>Oldest First</SelectItem>
                        <SelectItem value='price-low'>Price: Low to High</SelectItem>
                        <SelectItem value='price-high'>Price: High to Low</SelectItem>
                        <SelectItem value='area-low'>Area: Low to High</SelectItem>
                        <SelectItem value='area-high'>Area: High to Low</SelectItem>
                        <SelectItem value='title-asc'>Title: A to Z</SelectItem>
                        <SelectItem value='title-desc'>Title: Z to A</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Property Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
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

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2"
                    >
                        ← Previous
                    </Button>
                    <span className="text-sm whitespace-nowrap">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2"
                    >
                        Next →
                    </Button>
                </div>
            </div>

            {/* Dialogs - Update their content container sizes */}
            <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
                <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto md:max-w-3xl">
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
                                <Select
                                    name="measurement_type"
                                    value={selectedProperty?.measurement_type?.toString() || "1"}
                                    onValueChange={(value) =>
                                        setSelectedProperty(
                                            selectedProperty
                                                ? {
                                                      ...selectedProperty,
                                                      measurement_type: parseInt(value, 10),
                                                  }
                                                : null
                                        )
                                    }
                                >
                                    <SelectTrigger id="property-measurement-type" className='w-full'>
                                        <SelectValue placeholder='Select measurement type' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Square Feet</SelectItem>
                                        <SelectItem value="2">Square Meters</SelectItem>
                                        <SelectItem value="3">Square Yards</SelectItem>
                                        <SelectItem value="4">Acres</SelectItem>
                                    </SelectContent>
                                </Select>
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
                <DialogContent className="max-w-[90vw] md:max-w-md">
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
                <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto md:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Add New Property</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new property.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateProperty} className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            {/* Keep all other form fields the same, but remove currency and status fields */}
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
                                <Select
                                    name="measurement_type"
                                    value={newProperty.measurement_type.toString()}
                                    onValueChange={(value) =>
                                        setNewProperty(prev => ({
                                            ...prev,
                                            measurement_type: parseInt(value, 10)
                                        }))
                                    }
                                >
                                    <SelectTrigger id="new-property-measurement-type" className='w-full'>
                                        <SelectValue placeholder='Select measurement type' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Square Feet</SelectItem>
                                        <SelectItem value="2">Square Meters</SelectItem>
                                        <SelectItem value="3">Square Yards</SelectItem>
                                        <SelectItem value="4">Acres</SelectItem>
                                    </SelectContent>
                                </Select>
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
