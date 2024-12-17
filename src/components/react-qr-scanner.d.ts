//Typecrsipt declaration for react-qr-scanner module
declare module 'react-qr-scanner' {
  import React from 'react';

  interface QrScannerProps {
    facingMode: string;
    delay?: number;
    onError: (error: Error) => void;
    onScan: (data: string | null) => void;
    style?: React.CSSProperties;
  }

  export default class QrScanner extends React.Component<QrScannerProps, any> {}
}