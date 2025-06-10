// QRScanner.tsx
import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

const QRScanner: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [scannedResults, setScannedResults] = useState<string[]>([]);
    const [isScanning, setIsScanning] = useState(false); // Track whether we're currently processing a scan
    const scannedResultsSet = new Set<string>(); // Set to track unique scanned results
    const scanDelay = 2000; // Set the delay as 2000 ms (2 seconds)

    useEffect(() => {
        const qrScanner = new QrScanner(videoRef.current!, (result) => {
            // Check if scanning is currently disabled
            if (!isScanning) {
                if (typeof result === 'string' && !scannedResultsSet.has(result)) {
                    scannedResultsSet.add(result); // Add to set to prevent duplicates
                    setScannedResults((prevResults) => [...prevResults, result]);
                    setIsScanning(true); // Set the scanning state to true

                    // Set a timeout to reset the scanning state after the delay
                    setTimeout(() => {
                        setIsScanning(false); // Allow scanning again after the delay
                    }, scanDelay);
                } else if (result && typeof result === 'object') {
                    const resultStr = JSON.stringify(result);
                    if (!scannedResultsSet.has(resultStr)) {
                        scannedResultsSet.add(resultStr);
                        setScannedResults((prevResults) => [...prevResults, resultStr]);
                        setIsScanning(true); // Set the scanning state to true

                        // Set a timeout to reset the scanning state after the delay
                        setTimeout(() => {
                            setIsScanning(false); // Allow scanning again after the delay
                        }, scanDelay);
                    }
                }
                console.log(result); // Log scanned result
            }
        });

        qrScanner.start();

        return () => {
            qrScanner.stop(); // Stop scanning on component unmount
        };
    }, [isScanning]);

    const clearResults = () => {
        setScannedResults([]); // Clear the results
        scannedResultsSet.clear(); // Clear the unique results set
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>QR Code Scanner</h1>
            <div style={{ position: 'relative', width: '250px', height: '250px', overflow: 'hidden' }}>
                <video ref={videoRef} style={{ width: '100%', height: '100%' }} />
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '80%',
                    height: '80%',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    border: '5px dashed #ff0000',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    borderRadius: '8px'
                }} />
            </div>
            {scannedResults.length > 0 && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <h2>Scanned Results:</h2>
                    <ul>
                        {scannedResults.map((result, index) => (
                            <li key={index}>{result}</li> // Display each scanned result
                        ))}
                    </ul>
                    <button onClick={clearResults}>Clear Results</button>
                </div>
            )}
        </div>
    );
};

export default QRScanner;
