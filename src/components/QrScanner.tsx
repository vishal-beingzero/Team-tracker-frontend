import React, { useState, CSSProperties, useEffect } from 'react';
import { MdHeight } from 'react-icons/md';
import  {QrReader} from 'react-qr-reader';

const QRScanner: React.FC = () => {
    // Change data state to be an array
    const [scannedData, setScannedData] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [camera, setCamera] = useState<string>('environment');

    useEffect(()=>{
        console.log(camera);
    }, [camera])

    const handleScan = (result: any) => {
        if (result && result.text) {
            // Add the new scanned data to the array (if it doesn't already exist)
            if (!scannedData.includes(result.text)) {
                setScannedData((prevData) => [...prevData, result.text]);
            }
            setError(null); // Reset any previous errors
        }
    };

    const handleError = (err: any) => {
        setError(err.message);
    };

    const scannerStyle:CSSProperties = {
        width: '300px', // Set your desired width
        height: '300px', // Set your desired height
        margin: 'auto', // Center the scanner
        border: '2px solid #000', // Optional: Add a border for visibility
        position: 'relative', // Position relative for any inner elements
    };

    // Error: Failed to execute 'getUserMedia' on 'MediaDevices': At least one of audio and video must be requested
    return (
        <div style={{ textAlign: 'center' }}>
            <h1>QR Code Scanner</h1>
            <div style={scannerStyle}>
                <QrReader  
                    constraints={{facingMode:camera}}
                    // chooseDeviceId={choose}
                    onResult={handleScan}
                />
                <button onClick={()=>setCamera(camera=='user'?'environment':'user')}>toggle</button>
            </div>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {scannedData.length > 0 && (
                <div>
                    <h2>Scanned Data:</h2>
                    <ul>
                        {scannedData.map((data, index) => (
                            <li key={index}>{data}</li> // Display each scanned QR code
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default QRScanner;
