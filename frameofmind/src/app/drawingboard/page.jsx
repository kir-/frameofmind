'use client'
import React from 'react';
import 'react-canvas-paint/dist/index.css';
import dynamic from 'next/dynamic';

import DrawCanvas from './drawcanvas';

const ReactCanvasPaintNoSSR = dynamic(() => import('react-canvas-paint'), { ssr: false });

function DrawingBoard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Drawing Board</h1>
      <div className="w-full max-w-m"> {/* Set the maximum width of the canvas container */}
        {/* <ReactCanvasPaintNoSSR/> */}
        <DrawCanvas/>
      </div>
    </main>
   
  );
}

export default DrawingBoard;