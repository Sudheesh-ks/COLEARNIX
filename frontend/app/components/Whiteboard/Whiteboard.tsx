"use client"

import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";

interface WhiteboardProps {
  roomId: string;
  socket: Socket;
}

type Tool = "pencil" | "eraser";

export default function Whiteboard({ roomId, socket }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#6ee7b7");
  const [lineWidth, setLineWidth] = useState(5);
  const [tool, setTool] = useState<Tool>("pencil");
  const prevPos = useRef({ x: 0, y: 0 });
  const historyRef = useRef<any[]>([]);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set display size
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    }

    const context = canvas.getContext("2d");
    if (context) {
      context.scale(2, 2);
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      contextRef.current = context;

      // Redraw history after resize
      historyRef.current.forEach((action) => {
        if (action.type === "draw") {
          drawOnCanvas(action.prevX, action.prevY, action.currentX, action.currentY, action.color, action.size, action.tool, false, false);
        }
      });
    }
  }, [color, lineWidth]);

  useEffect(() => {
    setupCanvas();
    window.addEventListener("resize", setupCanvas);

    socket.on("whiteboard-draw", (data: any) => {
      const { prevX, prevY, currentX, currentY, color, size, tool } = data;
      drawOnCanvas(prevX, prevY, currentX, currentY, color, size, tool, false);
    });

    socket.on("whiteboard-clear", () => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      if (canvas && context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        historyRef.current = [];
      }
    });

    socket.on("whiteboard-history", (history: any[]) => {
      historyRef.current = history;
      history.forEach((action) => {
        if (action.type === "draw") {
          drawOnCanvas(action.prevX, action.prevY, action.currentX, action.currentY, action.color, action.size, action.tool, false, false);
        }
      });
    });

    return () => {
      window.removeEventListener("resize", setupCanvas);
      socket.off("whiteboard-draw");
      socket.off("whiteboard-clear");
      socket.off("whiteboard-history");
    };
  }, [socket, setupCanvas]);

  const drawOnCanvas = (
    prevX: number,
    prevY: number,
    currentX: number,
    currentY: number,
    strokeColor: string,
    width: number,
    drawTool: Tool,
    emit: boolean = true,
    store: boolean = true
  ) => {
    const context = contextRef.current;
    if (!context) return;

    if (store) {
      historyRef.current.push({ type: "draw", prevX, prevY, currentX, currentY, color: strokeColor, size: width, tool: drawTool });
    }

    context.beginPath();
    
    if (drawTool === "eraser") {
       context.globalCompositeOperation = 'destination-out';
    } else {
       context.globalCompositeOperation = 'source-over';
       context.strokeStyle = strokeColor;
    }
    
    context.lineWidth = width;
    context.moveTo(prevX, prevY);
    context.lineTo(currentX, currentY);
    context.stroke();
    context.closePath();

    if (emit) {
      socket.emit("whiteboard-draw", {
        roomId,
        drawData: { prevX, prevY, currentX, currentY, color: strokeColor, size: width, tool: drawTool },
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const { offsetX, offsetY } = getCoordinates(e);
    prevPos.current = { x: offsetX, y: offsetY };
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(e);
    drawOnCanvas(prevPos.current.x, prevPos.current.y, offsetX, offsetY, color, lineWidth, tool);
    prevPos.current = { x: offsetX, y: offsetY };
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY,
      };
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      historyRef.current = [];
      socket.emit("whiteboard-clear", roomId);
    }
  };

  return (
    <div className="whiteboard-wrapper">
      <div className="whiteboard-toolbar">
        <div className="tool-group">
          <button 
            className={`tool-btn ${tool === "pencil" ? "active" : ""}`} 
            onClick={() => setTool("pencil")}
            title="Pencil"
          >
            ✏️
          </button>
          <button 
            className={`tool-btn ${tool === "eraser" ? "active" : ""}`} 
            onClick={() => setTool("eraser")}
            title="Eraser"
          >
            🧽
          </button>
        </div>

        <div className="control-divider" />

        <div className="tool-group">
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)} 
            className="color-picker"
            title="Stroke Color"
            disabled={tool === "eraser"}
          />
          
          <div className="size-slider-wrapper">
            <span className="size-label">Size</span>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={lineWidth} 
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="size-slider"
              title="Brush Size"
            />
            <span className="size-value">{lineWidth}px</span>
          </div>
        </div>

        <div className="control-divider" />

        <button className="tool-btn clear-btn" onClick={clearCanvas} title="Clear All">
          🗑️
        </button>
      </div>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          className="whiteboard-canvas"
        />
      </div>

      <style jsx>{`
        .whiteboard-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-radius: 1rem;
          overflow: hidden;
          position: relative;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .whiteboard-toolbar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          z-index: 20;
        }
        .tool-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .tool-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1.1rem;
        }
        .tool-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        .tool-btn.active {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }
        .clear-btn:hover {
          background: #fee2e2;
          border-color: #fca5a5;
        }
        .control-divider {
          width: 1px;
          height: 24px;
          background: #e2e8f0;
        }
        .color-picker {
          width: 30px;
          height: 30px;
          padding: 0;
          border: none;
          background: none;
          cursor: pointer;
        }
        .color-picker:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .size-slider-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-left: 0.5rem;
        }
        .size-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .size-value {
          font-size: 0.8rem;
          font-weight: 600;
          color: #1e293b;
          min-width: 35px;
        }
        .size-slider {
          -webkit-appearance: none;
          width: 120px;
          height: 6px;
          background: #e2e8f0;
          border-radius: 5px;
          outline: none;
          transition: all 0.2s;
        }
        .size-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: var(--accent);
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .size-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: var(--accent);
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .canvas-container {
          flex: 1;
          position: relative;
          cursor: crosshair;
          background: #fff;
          overflow: hidden;
        }
        .whiteboard-canvas {
          touch-action: none;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
