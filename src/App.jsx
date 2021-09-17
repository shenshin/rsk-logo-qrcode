/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';
import styles from './App.module.css';
import graphics from './graphics';

const MIN_QR_SIZE = 100; // px
const MAX_QR_SIZE = 1000; // px
const MIN_IMG_SIZE = 0.1;
const MAX_IMG_SIZE = 0.5;

function App() {
  const [currentLogo, setCurrentLogo] = useState(0);
  const [qrSource, setQrSource] = useState('https://www.rsk.co/');
  const [hasLogo, setHasLogo] = useState(true);
  const [isStyled, setIsStyled] = useState(true);
  const [qrSize, setQrSize] = useState(200);
  const [imageSize, setImageSize] = useState(0.5);
  const qrRef = useRef();

  const validateInputs = () => {
    const newQrSize =
      qrSize <= MIN_QR_SIZE
        ? MIN_QR_SIZE
        : qrSize >= MAX_QR_SIZE
        ? MAX_QR_SIZE
        : qrSize;
    setQrSize(newQrSize);
    const newImageSize =
      imageSize <= MIN_IMG_SIZE
        ? MIN_IMG_SIZE
        : imageSize >= MAX_IMG_SIZE
        ? MAX_IMG_SIZE
        : imageSize;
    setImageSize(newImageSize);
    return { newQrSize, newImageSize };
  };

  const getOptions = () => {
    const { newQrSize, newImageSize } = validateInputs();
    const logo = graphics[currentLogo];
    return JSON.parse(
      JSON.stringify({
        width: newQrSize,
        height: newQrSize,
        type: 'svg',
        data: qrSource,
        image: hasLogo && `${process.env.PUBLIC_URL}/images/${logo.image}`,
        imageOptions: {
          imageSize: newImageSize,
          margin: logo.margin,
        },
        cornersSquareOptions: {
          color: isStyled && logo.colors.dark,
          type: isStyled && 'extra-rounded',
        },
        cornersDotOptions: {
          color: isStyled && logo.colors.bright,
        },
      }),
    );
  };

  const updateOptions = () => {
    const qrCode = new QRCodeStyling(getOptions());
    const targetDiv = qrRef.current;
    targetDiv.innerHTML = '';
    qrCode.append(targetDiv);
  };

  const downloadImage = () => {
    // I instantiate it again and don't put into react state
    // because the library probably has bugs and 'update'
    // method doen't update downloaded images
    const qrCode = new QRCodeStyling(getOptions());
    qrCode.download({
      name: qrSource,
      extension: 'png',
    });
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      updateOptions();
    }
  };

  useEffect(() => {
    updateOptions();
  }, [currentLogo, isStyled, hasLogo]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Generate QR-codes with IOVLabs logos</h1>
      <div className={styles.iconsContainer}>
        {graphics.map((logo, i) => (
          <div className={styles.icon} key={logo.name}>
            <img
              src={`${process.env.PUBLIC_URL}/images/${logo.image}`}
              className={styles.rskImage}
              alt={`${logo.name} logo`}
            />
            <input
              checked={i === currentLogo}
              type="radio"
              name="logo"
              value={i}
              onChange={(e) => setCurrentLogo(Number(e.target.value))}
            />
          </div>
        ))}
      </div>
      <label htmlFor="qr-source">
        String to encode
        <input
          id="qr-source"
          type="url"
          value={qrSource}
          onChange={(e) => setQrSource(e.target.value)}
          className={styles.sourceInput}
          onKeyPress={handleEnter}
        />
      </label>
      <label htmlFor="place-logo">
        {`Place ${graphics[currentLogo].name} logo`}
        <input
          type="checkbox"
          id="place-logo"
          checked={hasLogo}
          onChange={(e) => setHasLogo(e.target.checked)}
          onKeyPress={handleEnter}
        />
      </label>
      <label htmlFor="is-styled">
        Styled QR code
        <input
          type="checkbox"
          id="is-styled"
          checked={isStyled}
          onChange={(e) => setIsStyled(e.target.checked)}
          onKeyPress={handleEnter}
        />
      </label>
      <label htmlFor="qr-size">
        {`QR size (${MIN_QR_SIZE}px - ${MAX_QR_SIZE}px)`}
        <input
          type="number"
          min={MIN_QR_SIZE}
          max={MAX_QR_SIZE}
          step="10"
          id="qr-size"
          value={qrSize}
          onChange={(e) => setQrSize(e.target.value)}
          className={styles.numberInput}
          onKeyPress={handleEnter}
        />
      </label>
      <label htmlFor="image-size">
        {`Image size (${MIN_IMG_SIZE} - ${MAX_IMG_SIZE})`}
        <input
          type="number"
          min={MIN_IMG_SIZE}
          max={MAX_IMG_SIZE}
          step="0.05"
          id="image-size"
          value={imageSize}
          onChange={(e) => setImageSize(e.target.value)}
          className={styles.numberInput}
          onKeyPress={handleEnter}
        />
      </label>
      <button type="button" onClick={updateOptions} onKeyPress={handleEnter}>
        Update QR code
      </button>
      <div ref={qrRef} />
      <button type="button" onClick={downloadImage}>
        Download PNG
      </button>
    </div>
  );
}

export default App;
