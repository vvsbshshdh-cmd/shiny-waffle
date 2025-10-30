import React, { useEffect, useState } from 'react';
import { getNetworkStatus } from '../services/networkMonitor';
import './popup.css';

const Popup = () => {
    const [networkStatus, setNetworkStatus] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNetworkStatus = async () => {
            try {
                const status = await getNetworkStatus();
                setNetworkStatus(status);
            } catch (err) {
                setError('Failed to fetch network status');
            }
        };

        fetchNetworkStatus();
    }, []);

    return (
        <div className="popup">
            <h1>Network Monitor</h1>
            {error && <p className="error">{error}</p>}
            {networkStatus ? (
                <div>
                    <h2>Status: {networkStatus.isOnline ? 'Online' : 'Offline'}</h2>
                    <p>Requests: {networkStatus.requestCount}</p>
                    <p>Errors: {networkStatus.errorCount}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Popup;