import React from 'react';
import { Button } from './ui/button';

interface ModernCardProps {
    title: string;
    subtitle: string;
    description: string;
    onEdit: () => void;
    onDelete: () => void;
}

const ModernCard: React.FC<ModernCardProps> = ({
    title,
    subtitle,
    description,
    onEdit,
    onDelete
}) => {
    return (
        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h2>
                    <p className="text-lg font-semibold text-gray-600">{subtitle}</p>
                </div>
                <p className="text-gray-600 leading-relaxed">{description}</p>
                <div className="pt-4 flex justify-end space-x-2">
                    <Button
                        onClick={onEdit}
                        variant="outline"
                        className="bg-yellow-200 hover:bg-yellow-300 border-none"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={onDelete}
                        variant="destructive"
                        className="bg-red-50 hover:bg-red-100 text-red-600"
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ModernCard;
