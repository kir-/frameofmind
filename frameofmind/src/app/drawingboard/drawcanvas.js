import { useEffect, useRef, useState } from "react";

import Menu from "./menu";
import "./drawcanvas.css";

    function DrawCanvas() {
        const canvasRef = useRef(null);
        const ctxRef = useRef(null);
        const [isDrawing, setIsDrawing] = useState(false);
        const [lineWidth, setLineWidth] = useState(5);
        const [lineColor, setLineColor] = useState("black");
        const [lineOpacity, setLineOpacity] = useState(0.1);
        const [imageData, setImageData] = useState(null); //store  img data
        const [isEraser, setEraser] = useState(false);

        //initialization when component mounts for the first time
        useEffect(() => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctxRef.current = ctx;

            //setting initial canvas background color
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }, []);

        //update drawing settings when dependencies change
        useEffect(() => {
            const ctx = ctxRef.current;
            ctx.globalAlpha = lineOpacity;
            ctx.strokeStyle = isEraser ? "white" : lineColor;
            ctx.lineWidth = isEraser ? 20 : lineWidth;
        }, [lineColor, lineOpacity, lineWidth, isEraser]);

        //function for starting the draw
        const startDrawing = (e) => {
            e.preventDefault(); // Prevent default behavior
            const { offsetX, offsetY } = e.nativeEvent;
            ctxRef.current.beginPath();
            ctxRef.current.moveTo(offsetX, offsetY);
            setIsDrawing(true);
        };

        //function for starting the draw with touch (for ipad)
        const startDrawingTouch = (e) => {
            e.preventDefault(); // Prevent default behavior
            const rect = canvasRef.current.getBoundingClientRect();
            const touch = e.touches[0];
            const offsetX = touch.clientX - rect.left;
            const offsetY = touch.clientY - rect.top;
            ctxRef.current.beginPath();
            ctxRef.current.moveTo(offsetX, offsetY);
            setIsDrawing(true);
        };

        //function for ending draw
        const endDrawing = (e) => {
            e.preventDefault(); //prevent default behavior
            ctxRef.current.closePath();
            setIsDrawing(false);
        };

        const draw = (e) => {
            if (!isDrawing) return;
            e.preventDefault(); //prevent default behavior
            const { offsetX, offsetY } = e.nativeEvent;
            ctxRef.current.lineTo(offsetX, offsetY);
            ctxRef.current.stroke();
        };

        const drawTouch = (e) => {
            if (!isDrawing) return;
            e.preventDefault(); //prevent default behavior
            const rect = canvasRef.current.getBoundingClientRect();
            const touch = e.touches[0];
            const offsetX = touch.clientX - rect.left;
            const offsetY = touch.clientY - rect.top;
            ctxRef.current.lineTo(offsetX, offsetY);
            ctxRef.current.stroke();
        };

        //function to convert drawing to image
        const convertToImage = () => {
            const canvas = canvasRef.current;
            const dataURL = canvas.toDataURL(); // Convert canvas to data URL
            setImageData(dataURL); // Store the image data
        };

        //function to download image
        const downloadImage = () => {
            const link = document.createElement("a");
            link.href = imageData;
            link.download = "drawing.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        //eraser method to control cleaning method for the strokes
        const toggleEraser = () => {
            setEraser(!isEraser);
        };

        //cleaning the canvas (remove all strokes)
        const clearCanvas = () => {
            const canvas = canvasRef.current;
            const ctx = ctxRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //reset the canvas background color
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        return (
            <div className="App">
                <div className="draw-area">
                    <Menu
                        setLineColor={color => {
                            setLineColor(color);
                            if (!isEraser) ctxRef.current.strokeStyle = color;
                        }}
                        setLineWidth={width => {
                            setLineWidth(width);
                            if (!isEraser) ctxRef.current.lineWidth = width;
                        }}
                        setLineOpacity={setLineOpacity}
                    />
                    <canvas
                        onMouseDown={startDrawing}
                        onMouseUp={endDrawing}
                        onMouseMove={draw}
                        onTouchStart={startDrawingTouch}
                        onTouchEnd={endDrawing}
                        onTouchMove={drawTouch}
                        ref={canvasRef}
                        width={`1080px`}
                        height={`600px`}
                    />
                </div>
                <div>
                        <button onClick={convertToImage}>Convert to Image</button>
                        {imageData && <button onClick={downloadImage}>Download Image</button>}
                        <button onClick={toggleEraser}>{isEraser ? "Switch to Pen" : "Switch to Eraser"}</button>
                        <button onClick={clearCanvas}>Remove All Strokes</button> {/* Clear canvas button */}
                </div>
            </div>
        );
    }

    export default DrawCanvas;
