"use client"

import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";

interface WhiteboardProps {
  roomId: string;
  socket: Socket;
}

type Tool = "pencil" | "eraser";

import "./Whiteboard.css";

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

    </div>
  );
}
