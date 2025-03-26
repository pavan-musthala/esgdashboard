const API_URL = 'http://localhost:5000/api';

export const dataApi = {
    getData: async () => {
        try {
            const response = await fetch(`${API_URL}/data`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },

    addData: async (newData) => {
        try {
            const response = await fetch(`${API_URL}/data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding data:', error);
            throw error;
        }
    }
};