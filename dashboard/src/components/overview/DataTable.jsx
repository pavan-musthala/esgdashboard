import React from 'react';
import { useData } from './DataContext';

const DataTable = () => {
    const { data, loading, error } = useData();

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;
    if (!data || data.length === 0) return <div className="text-center p-4">No data available</div>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white/10 rounded-lg">
                <thead>
                    <tr>
                        <th className="p-3 text-left">Company Name</th>
                        <th className="p-3 text-left">Fund</th>
                        <th className="p-3 text-left">Investment ($M)</th>
                        <th className="p-3 text-left">Country</th>
                        <th className="p-3 text-left">Theme</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item.companyId || index} className="border-t border-white/10">
                            <td className="p-3">{item.companyName}</td>
                            <td className="p-3">{item.fund}</td>
                            <td className="p-3">{item.investment}</td>
                            <td className="p-3">{item.country}</td>
                            <td className="p-3">{item.theme}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;