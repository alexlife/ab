import React, { createContext, useState, useContext } from 'react';

const SpecContext = createContext();

export const useSpec = () => {
    return useContext(SpecContext);
};

export const SpecProvider = ({ children }) => {
    const [showSpecs, setShowSpecs] = useState(false);
    const [selectedSpecId, setSelectedSpecId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSpecs = () => {
        setShowSpecs(prev => !prev);
        if (showSpecs) {
            setIsSidebarOpen(false);
            setSelectedSpecId(null);
        }
    };

    const openSpecDetails = (specId) => {
        setSelectedSpecId(specId);
        setIsSidebarOpen(true);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <SpecContext.Provider value={{
            showSpecs,
            toggleSpecs,
            selectedSpecId,
            openSpecDetails,
            isSidebarOpen,
            closeSidebar
        }}>
            {children}
        </SpecContext.Provider>
    );
};
