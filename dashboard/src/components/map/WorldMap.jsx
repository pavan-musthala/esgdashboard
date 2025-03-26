import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { dataApi } from '../../api/dataApi';
import 'leaflet/dist/leaflet.css';
import CompanyFilter from '../CompanyFilter';

// Country coordinates
const countryCoords = {
    'Indonesia': [-0.7893, 113.9213],
    'South Africa': [-30.5595, 22.9375],
    'Tanzania': [-6.3690, 34.8888],
    'Brazil': [-14.2350, -51.9253],
    'Nigeria': [9.0820, 8.6753],
    'Kenya': [-1.2864, 36.8172],
    'Mexico': [23.6345, -102.5528],
    'India': [20.5937, 78.9629],
    'Bangladesh': [23.6850, 90.3563],
    'Thailand': [15.8700, 100.9925]
};

const addJitter = (coords, jitterAmount = 0.5) => {
    const [lat, lon] = coords;
    const jitteredLat = lat + (Math.random() * jitterAmount * 2) - jitterAmount;
    const jitteredLon = lon + (Math.random() * jitterAmount * 2) - jitterAmount;
    return [jitteredLat, jitteredLon];
};

const WorldMap = ({ selectedCompany }) => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await dataApi.getData();
                setCompanies(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch company data. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const mapCenter = [20.5937, 78.9629]; // Center on India
    const zoomLevel = 3;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    
    const customIcon = new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41]
    });

    const filteredCompanies = selectedCompany
        ? companies.filter(company => company.companyName === selectedCompany)
        : companies;

    return (
        <div>
            <h2>Company Map</h2>
            <MapContainer center={mapCenter} zoom={zoomLevel} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                {filteredCompanies.map((company, index) => {
                    const coords = countryCoords[company.country];
                    if (coords) {
                        const jitteredCoords = addJitter(coords, 0.3);
                        return (
                            <Marker key={`${company.companyName}-${index}`} position={jitteredCoords} icon={customIcon}>
                                <Popup>
                                    <strong>{company.companyName}</strong><br />
                                    Country: {company.country}
                                </Popup>
                            </Marker>
                        );
                    }
                    return null;
                })}
            </MapContainer>
        </div>
    );
};

export default WorldMap;
