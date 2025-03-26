import React, { createContext, useContext, useState, useEffect } from "react";
import { dataApi } from "../../api/dataApi";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const result = await dataApi.getData();
            setData(result);
            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{ 
            data, 
            loading, 
            error, 
            refreshData: fetchData 
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};