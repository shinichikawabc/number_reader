import React, { useRef, useState, useEffect } from 'react';
import model from './Model';
import * as tf from '@tensorflow/tfjs';

const DrawingCanvas = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [prediction, setPrediction] = useState();
    useEffect(() => {
        document.getElementById('predict').innerText = prediction;
    }, [prediction]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Set the canvas background to white
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
    }, []);

    const startDrawing = (e) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / (rect.width / 28));
        const y = Math.floor((e.clientY - rect.top) / (rect.height / 28));

        ctx.fillStyle = 'black'; // Set fill color
        const penSize = 3; // Increase this value for a thicker pen

        ctx.fillRect(x, y, penSize, penSize); // Draw a square with the specified pen size
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const getPixelData = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const pixels = [];
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const grayscale = r * 0.3 + g * 0.59 + b * 0.11;
            const isWhite = r > 128 ? 1 : 0; // 1 for white, 0 for black
            pixels.push(grayscale); 
        }

        const pixelArray = [];
        while (pixels.length) pixelArray.push(pixels.splice(0, 28));


        return pixelArray;
    };

    const processDrawing = (pixelArray) => {//assuming pixelArray is of legal format and shape
        let data = tf.tensor(pixelArray);

        data = data.reshape([1, 28, 28, 1]); // adding channel dimensions

        data = data.asType('float32').div(tf.scalar(255)); //normalize 

        return data;
    }

    const getPredict =(pos) => {
        let max = pos[1];
        let index = 0;
        for (var i = 0; i < pos.length; i++) {
            if (pos[i] > max) {
                max = pos[i];
                index = i; 
            }
        }
        return index;
    }

    const readNumber = () => {
        const pixelArray = getPixelData();
        const data = processDrawing(pixelArray);
        const result = model.predict(data);
        const value = result.dataSync();
        const number = getPredict(Array.from(value));
        console.log(number);
        console.log(Array.from(value));
        setPrediction(number);
    }

    return (
        <div>
            <b id = 'predict'></b>
            <canvas
                ref={canvasRef}
                width={28}
                height={28}
                style={{
                    border: '1px solid black',
                    imageRendering: 'pixelated',
                    width: '280px',
                    height: '280px',
                    cursor: 'crosshair',
                }}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onMouseLeave={stopDrawing} // Stops drawing if mouse leaves the canvas
            />
            <div>
                <button onClick={clearCanvas}>Clear Canvas</button>
                <button onClick={readNumber}>Read Number</button>
            </div>
        </div>
    );
};

export default DrawingCanvas;