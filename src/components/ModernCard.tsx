import React from 'react';
import { Button } from './ui/button';

interface ModernCardProps {
    title: string;
    subtitle: string;
    description: string;
    onEdit: () => void;
    onDelete: () => void;
}

export const ModernCard: React.FC<ModernCardProps> = ({
    title,
    subtitle,
    description,
    onEdit,
    onDelete,
}) => {
    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col h-full'>
            <div className='flex flex-col flex-grow'>
                <h3 className='text-lg font-semibold mb-2 line-clamp-2'>
                    {title}
                </h3>
                <p className='text-primary font-medium mb-2'>{subtitle}</p>
                <p className='text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2'>
                    {description}
                </p>
            </div>
            <div className='flex gap-2 mt-auto pt-4 border-t'>
                <Button
                    onClick={onEdit}
                    variant='outline'
                    className='bg-yellow-200 hover:bg-yellow-300 border-none'
                >
                    Edit
                </Button>
                <Button
                    onClick={onDelete}
                    variant='destructive'
                    className='bg-red-50 hover:bg-red-100 text-red-600'
                >
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default ModernCard;
