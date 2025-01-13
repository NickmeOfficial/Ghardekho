import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
} from 'react';
import {
    PropertyDetails,
    PropertyResponse,
    PropertyListResponse,
} from '../types/property';

interface PropertyContextType {
    properties: PropertyDetails[];
    setProperties: React.Dispatch<React.SetStateAction<PropertyDetails[]>>;
    loading: boolean;
    error: string | null;
    fetchPropertyList: (
        searchTerm?: string,
        page?: number,
        limit?: number
    ) => Promise<void>;
    updateProperty: (
        propertyId: number,
        propertyData: Partial<PropertyDetails>
    ) => Promise<PropertyDetails>;
    deleteProperty: (propertyId: number) => Promise<void>;
    createProperty: (propertyData: Omit<PropertyDetails, 'id'>) => Promise<PropertyDetails>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(
    undefined
);

const transformProperty = (
    responseProperty: PropertyResponse
): PropertyDetails => ({
    id: responseProperty.property_id,
    title: responseProperty.title,
    description: responseProperty.description,
    created_by: responseProperty.created_by || '',
    price: responseProperty.price,
    currency: responseProperty.currency,
    email: responseProperty.email,
    mobile: responseProperty.mobile,
    property_type: responseProperty.property_type,
    area: responseProperty.area,
    measurement_type: responseProperty.measurement_type,
    is_featured: responseProperty.is_featured,
    status: responseProperty.status,
});

const transformPropertyForUpdate = (
    propertyDetails: PropertyDetails
): Partial<PropertyResponse> => {
    const propertyData = {
        title: propertyDetails.title,
        description: propertyDetails.description,
        created_by: propertyDetails.created_by,
        price: propertyDetails.price.toString(),
        currency: propertyDetails.currency,
        email: propertyDetails.email,
        mobile: propertyDetails.mobile,
        property_type: propertyDetails.property_type,
        area: propertyDetails.area,
        measurement_type: propertyDetails.measurement_type,
        is_featured: propertyDetails.is_featured,
        status: propertyDetails.status,
    };

    return Object.fromEntries(
        Object.entries(propertyData).filter(([_, v]) => v != null)
    ) as Partial<PropertyResponse>;
};

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [properties, setProperties] = useState<PropertyDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPropertyList = async (
        searchTerm: string = '',
        page: number = 1,
        limit: number = 10
    ) => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:3000/property?page=${page}&limit=${limit}&search=${searchTerm}`
            );
            if (!response.ok) throw new Error('Failed to fetch properties');
            const data: PropertyListResponse = await response.json();
            const transformedProperties = data.data.map(transformProperty);
            setProperties(transformedProperties);
        } catch (err) {
            setError('Error fetching properties');
            console.error('Error fetching properties:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateProperty = async (
        propertyId: number,
        propertyData: Partial<PropertyDetails>
    ): Promise<PropertyDetails> => {
        const transformedData = transformPropertyForUpdate(
            propertyData as PropertyDetails
        );
        const response = await fetch(
            `http://localhost:3000/property/${propertyId}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transformedData),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                Array.isArray(errorData.message)
                    ? errorData.message.join(', ')
                    : errorData.message || 'Unknown error'
            );
        }

        const updatedProperty = await response.json();
        const transformedProperty = transformProperty(updatedProperty);

        setProperties((prev) =>
            prev.map((p) => (p.id === propertyId ? transformedProperty : p))
        );

        return transformedProperty;
    };

    const deleteProperty = async (propertyId: number): Promise<void> => {
        const response = await fetch(
            `http://localhost:3000/property/${propertyId}`,
            {
                method: 'DELETE',
            }
        );
        if (!response.ok) throw new Error('Failed to delete property');

        setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    };

    const createProperty = async (propertyData: Omit<PropertyDetails, 'id'>): Promise<PropertyDetails> => {
        const transformedData = transformPropertyForUpdate(propertyData as PropertyDetails);
        const response = await fetch('http://localhost:3000/property', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transformedData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                Array.isArray(errorData.message)
                    ? errorData.message.join(', ')
                    : errorData.message || 'Unknown error'
            );
        }

        const newProperty = await response.json();
        const transformedProperty = transformProperty(newProperty);
        setProperties((prev) => [...prev, transformedProperty]);
        return transformedProperty;
    };

    useEffect(() => {
        fetchPropertyList();
    }, []);

    return (
        <PropertyContext.Provider
            value={{
                properties,
                setProperties,
                loading,
                error,
                fetchPropertyList,
                updateProperty,
                deleteProperty,
                createProperty,
            }}
        >
            {children}
        </PropertyContext.Provider>
    );
};

export const usePropertyContext = () => {
    const context = useContext(PropertyContext);
    if (!context) {
        throw new Error(
            'usePropertyContext must be used within a PropertyProvider'
        );
    }
    return context;
};
