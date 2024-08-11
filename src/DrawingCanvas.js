import React, { useRef, useState, useEffect } from 'react';

const DrawingCanvas = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

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
        ctx.fillRect(x, y, 1, 1);
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
            pixels.push(grayscale); // Push grayscale value (0-255) directly
        }

        const pixelArray = [];
        while (pixels.length) pixelArray.push(pixels.splice(0, 28));

        console.log(pixelArray);
    };

    return (
        <div>
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
                <button onClick={getPixelData}>Get Pixel Data</button>
            </div>
        </div>
    );
};

export default DrawingCanvas;