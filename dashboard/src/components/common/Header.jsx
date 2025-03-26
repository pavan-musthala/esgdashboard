import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react'; // Import Plus icon

const Header = ({ title }) => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            <button
                onClick={() => navigate('/add-data')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
                <Plus className="w-5 h-5" />
                Add Data
            </button>
        </div>
    );
};

export default Header;
