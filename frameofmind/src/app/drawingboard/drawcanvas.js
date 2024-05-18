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
    const [imageData, setImageData] = useState(null); // Store the image data
  
    // Initialization when the component 
    // mounts for the first time 
    useEffect(() => { 
        const canvas = canvasRef.current; 
        const ctx = canvas.getContext("2d"); 
        ctx.lineCap = "round"; 
        ctx.lineJoin = "round"; 
        ctx.globalAlpha = lineOpacity; 
        ctx.strokeStyle = lineColor; 
        ctx.lineWidth = lineWidth; 
        ctxRef.current = ctx; 
    }, [lineColor, lineOpacity, lineWidth]); 
  
    // Function for starting the drawing 
    const startDrawing = (e) => { 
        ctxRef.current.beginPath(); 
        ctxRef.current.moveTo( 
            e.nativeEvent.offsetX, 
            e.nativeEvent.offsetY 
        ); 
        setIsDrawing(true); 
    }; 
  
    // Function for ending the drawing 
    const endDrawing = () => { 
        ctxRef.current.closePath(); 
        setIsDrawing(false); 
    }; 
  
    const draw = (e) => { 
        if (!isDrawing) { 
            return; 
        } 
        ctxRef.current.lineTo( 
            e.nativeEvent.offsetX, 
            e.nativeEvent.offsetY 
        ); 
  
        ctxRef.current.stroke(); 
    }; 
  
    // Function to convert drawing to image
    const convertToImage = () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL(); // Convert canvas to data URL
        setImageData(dataURL); // Store the image data
    };
  
    // Function to download image
    const downloadImage = () => {
        const link = document.createElement("a");
        link.href = imageData;
        link.download = "drawing.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
  
    return ( 
        <div className="App"> 
            <h1>Paint App</h1> 
            <div className="draw-area"> 
                <Menu 
                    setLineColor={setLineColor} 
                    setLineWidth={setLineWidth} 
                    setLineOpacity={setLineOpacity} 
                /> 
                <canvas 
                    onMouseDown={startDrawing} 
                    onMouseUp={endDrawing} 
                    onMouseMove={draw} 
                    ref={canvasRef} 
                    width={`1280px`} 
                    height={`720px`} 
                /> 
                <div>
                    <button onClick={convertToImage}>Convert to Image</button> {/* Button to trigger conversion */}
                    {imageData && <button onClick={downloadImage}>Download Image</button>} {/* Button to download image if available */}
                </div>
            </div> 
        </div> 
    ); 
} 
  
export default DrawCanvas;
