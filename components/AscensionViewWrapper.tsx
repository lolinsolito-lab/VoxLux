import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AscensionView } from './AscensionView';

export const AscensionViewWrapper: React.FC = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/dashboard');
    };

    return <AscensionView onBack={handleBack} />;
};
