import React from 'react';
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from './pages/OverviewPage';
import TopCompaniesPage from './pages/TopCompaniesPage';
import EnvironmentalImpactPage from "./pages/EnvironmentalImpactPage";
import AnalyticsPage from './pages/AnalyticsPage';
import MapsPage from './pages/MapsPage';
import SettingsPage from './pages/SettingsPage';
import AddDataPage from './pages/AddDataPage';
import { DataProvider } from './components/overview/DataContext';

function App() {
    return (
        <DataProvider>
            <div className='flex h-screen bg-gray-900 text-gray-100'>
                <Sidebar />
                <div className="flex-1 overflow-auto">
                    <Routes>
                        <Route path="/" element={<OverviewPage />} />
                        <Route path="/top-companies" element={<TopCompaniesPage />} />
                        <Route path='/environmental-impact' element={<EnvironmentalImpactPage />} />
                        <Route path="/analytics" element={<AnalyticsPage />} />
                        <Route path="/maps" element={<MapsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/add-data" element={<AddDataPage />} />
                    </Routes>
                </div>
            </div>
        </DataProvider>
    );
}

export default App;