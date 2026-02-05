import { useState, useEffect } from 'react';
import { getExperiments } from '../store/mockStore';

export const useExperiments = () => {
    const [experiments, setExperiments] = useState([]);

    const fetchExperiments = () => {
        setExperiments(getExperiments());
    };

    useEffect(() => {
        fetchExperiments();

        const handleUpdate = () => fetchExperiments();

        window.addEventListener('ab_store_updated', handleUpdate);
        window.addEventListener('ab_store_reset', handleUpdate);

        return () => {
            window.removeEventListener('ab_store_updated', handleUpdate);
            window.removeEventListener('ab_store_reset', handleUpdate);
        };
    }, []);

    return experiments;
};
