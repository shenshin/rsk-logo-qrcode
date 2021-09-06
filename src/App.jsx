import { useState, useRef, useCallback } from 'react';
import './App.css';
import QRCodeStyling from 'qr-code-styling';
import rskLogo from './rsk_logo.svg';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  title: {
    marginBottom: 0,
  },
  rskImage: {
    marginTop: '-1rem',
    width: 100,
    height: 100,
  },
  generateButton: {
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '1.5rem',
  },
  numberInput: {
    width: '3rem',
  },
  sourceInput: {
    width: '50vw',
  },
};

function App() {
  const [qrSource, setQrSource] = useState('https://www.rsk.co/');
  const [hasLogo, setHasLogo] = useState(true);
  const [qrSize, setQrSize] = useState(200);
  const [imageSize, setImageSize] = useState(0.5);
  const [errorMessage, setErrorMessage] = useState('');
  const qrRef = useRef();

  const validateInputs = () => {
    const newQrSize = qrSize <= 30 ? 30 : qrSize >= 1000 ? 1000 : qrSize;
    setQrSize(newQrSize);
    const newImageSize =
      imageSize <= 0 ? 0.0 : imageSize >= 0.5 ? 0.5 : imageSize;
    setImageSize(newImageSize);
    return { newQrSize, newImageSize };
  };

  const generateQRCode = useCallback(() => {
    try {
      const { newQrSize, newImageSize } = validateInputs();
      const options = {
        width: newQrSize,
        height: newQrSize,
        type: 'svg',
        data: qrSource,
        image: hasLogo ? rskLogo : undefined,
        imageOptions: {
          imageSize: newImageSize,
          margin: 5,
        },
      };
      const qr = new QRCodeStyling(options);
      const targetDiv = qrRef.current;
      targetDiv.innerHTML = '';
      qr.append(targetDiv);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [qrSize, imageSize, qrSource, hasLogo]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Generate QR-code with RSK image</h1>
      <img style={styles.rskImage} alt="RSK logo" src={rskLogo} />
      <label htmlFor="qr-source">
        String to encode
        <input
          id="qr-source"
          type="url"
          value={qrSource}
          onChange={(e) => setQrSource(e.target.value)}
          style={styles.sourceInput}
        />
      </label>
      <label htmlFor="place-logo">
        Place RSK logo
        <input
          type="checkbox"
          id="place-logo"
          checked={hasLogo}
          onChange={(e) => setHasLogo(e.target.checked)}
        />
      </label>
      <label htmlFor="qr-size">
        QR size (30px - 1000px)
        <input
          type="number"
          step="10"
          id="qr-size"
          value={qrSize}
          onChange={(e) => setQrSize(e.target.value)}
          style={styles.numberInput}
        />
      </label>
      <label htmlFor="image-size">
        Image size (0 - 0.5)
        <input
          type="number"
          step="0.01"
          id="image-size"
          value={imageSize}
          onChange={(e) => setImageSize(e.target.value)}
          style={styles.numberInput}
        />
      </label>
      <button
        type="button"
        onClick={generateQRCode}
        style={styles.generateButton}
      >
        Generate a QR code
      </button>
      <div ref={qrRef} />
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
    </div>
  );
}

export default App;
