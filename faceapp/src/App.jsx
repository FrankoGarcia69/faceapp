import './App.css';
import { useRef, useEffect } from 'react'

import faceapi from './face-api.js'

function App() {
  const videoRef = useRef()
  const canvasRef = useRef()

    //Pedir acceso a la camara
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      videoRef.srcObject = stream;
    })();

  async function onPlay() {
    const MODEL_URL = '/public/models';

    //carga de los modelos a utilizar
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
    await faceapi.loadFaceLandmarkModel(MODEL_URL)
    await faceapi.loadFaceRecognitionModel(MODEL_URL)
    await faceapi.loadFaceExpressionModel(MODEL_URL)

    let fullFaceDescriptions = await faceapi.detectAllFaces(videoRef)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions();

    const dims = faceapi.matchDimensions(canvasRef, videoRef, true); //Ajusta el tamanio del video con el canvas
    const resizedResults = faceapi.resizeResults(fullFaceDescriptions, dims); //Redimensiona

    faceapi.draw.drawDetections(canvasRef, resizedResults);
    faceapi.draw.drawFaceLandmarks(canvasRef, resizedResults);
    faceapi.draw.drawFaceExpressions(canvasRef, resizedResults, 0.05);

    setTimeout(() => onPlay(), 50)

  }
  return (
    
    <div className='myApp'>
      <h1>Login</h1>
      <faceapi />
      <div className="appVideo">
        <video onloadedmetadata={onPlay(this)} crossOrigin='anonymous' ref={videoRef}></video>
      </div>
      <canvas ref={canvasRef} width='940' height='650' className='appCanvas'
      />

    </div>
  )
}


export default App;
