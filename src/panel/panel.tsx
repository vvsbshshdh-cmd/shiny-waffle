import React, { useEffect, useState } from 'react';
import { fetchNetworkData } from '../services/networkMonitor';
import './panel.css';

const Panel = () => {
    const [networkData, setNetworkData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadNetworkData = async () => {
            try {
                const data = await fetchNetworkData();
                setNetworkData(data);
            } catch (err) {
                setError('Failed to load network data');
            } finally {
                setLoading(false);
            }
        };

        loadNetworkData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="panel">
            <h1>Network Monitor</h1>
            <ul>
                {networkData.map((item, index) => (
                    <li key={index}>
                        <strong>Request:</strong> {item.request} <br />
                        <strong>Response:</strong> {item.response}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Panel;