"use client"

import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Socket } from "socket.io-client";
import { roomService } from "../../services/roomService";

interface CodeEditorProps {
  roomId: string;
  socket: Socket;
}

const LANGUAGES = [
  { label: "JavaScript", value: "javascript", version: "18.15.0" },
  { label: "TypeScript", value: "typescript", version: "5.0.3" },
  { label: "Python", value: "python", version: "3.10.0" },
  { label: "Java", value: "java", version: "15.0.2" },
  { label: "C++", value: "cpp", version: "10.2.0" },
  { label: "HTML", value: "html", version: "unknown" },
  { label: "CSS", value: "css", version: "unknown" },
];

export default function CodeEditor({ roomId, socket }: CodeEditorProps) {
  const [code, setCode] = useState<string>("// Start coding here...\n");
  const [language, setLanguage] = useState<string>("javascript");
  const [output, setOutput] = useState<string>("Click 'Run' to see output...");
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const isRemoteChange = useRef(false);

  useEffect(() => {
    socket.on("code-sync", (newCode: string) => {
      isRemoteChange.current = true;
      setCode(newCode);
      setTimeout(() => { isRemoteChange.current = false; }, 100);
    });

    socket.on("code-language-sync", (newLanguage: string) => {
      setLanguage(newLanguage);
    });

    socket.on("code-output-sync", (newOutput: string) => {
      setOutput(newOutput);
    });

    socket.on("code-history", (data: { code: string; language: string }) => {
      setCode(data.code);
      setLanguage(data.language);
    });

    return () => {
      socket.off("code-sync");
      socket.off("code-language-sync");
      socket.off("code-output-sync");
      socket.off("code-history");
    };
  }, [socket]);

  const handleEditorChange = (value: string | undefined) => {
    if (isRemoteChange.current) return;
    
    const newCode = value || "";
    setCode(newCode);
    socket.emit("code-sync", { roomId, code: newCode });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    socket.emit("code-language-sync", { roomId, language: newLang });
  };

  const runCode = async () => {
    if (language === "html" || language === "css") {
      const result = "Execution not supported for static files (HTML/CSS) in this preview.";
      setOutput(result);
      socket.emit("code-output-sync", { roomId, output: result });
      return;
    }

    setIsRunning(true);
    setOutput("Executing...");
    
    const selectedLang = LANGUAGES.find(l => l.value === language);
    
    try {
      const response = await roomService.executeCode(
        language,
        selectedLang?.version || "*",
        code
      );

      const data = response.data.data; // Our backend wraps it in { success, data: { run: { stdout, stderr ... } } }
      const executionOutput = data.run.stderr || data.run.stdout || "Success (no output)";
      setOutput(executionOutput);
      socket.emit("code-output-sync", { roomId, output: executionOutput });
    } catch (error) {
      const errorMsg = "Failed to execute code. Execution service unavailable.";
      setOutput(errorMsg);
      socket.emit("code-output-sync", { roomId, output: errorMsg });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="code-editor-wrapper">
      <div className="editor-toolbar">
        <div className="tool-group">
          <div className="tool-label">LANGUAGE</div>
          <select 
            value={language} 
            onChange={handleLanguageChange}
            className="language-select"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <button 
          className={`run-btn ${isRunning ? "running" : ""}`} 
          onClick={runCode}
          disabled={isRunning}
        >
          {isRunning ? "RUNNING..." : "RUN"}
          {!isRunning && <span className="play-icon">▶</span>}
        </button>

        <div className="control-divider" />

        <div className="editor-status">
          <div className="status-dot green" />
          <span>LIVE COLLABORATION</span>
        </div>
      </div>

      <div className="main-editor-layout">
        <div className="editor-container">
          <Editor
            height="100%"
            language={language}
            value={code}
            theme="vs-dark"
            onChange={handleEditorChange}
            options={{
              fontSize: 16,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 20 },
              fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
              fontLigatures: true,
            }}
          />
        </div>

        {showOutput && (
          <div className="output-panel">
            <div className="output-header">
              <span>OUTPUT</span>
              <button 
                className="clear-output" 
                onClick={() => setOutput("Waiting for code execution...")}
              >
                CLEAR
              </button>
            </div>
            <pre className="output-content">
              {output}
            </pre>
          </div>
        )}
      </div>

      <style jsx>{`
        .code-editor-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #1e1e1e;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .editor-toolbar {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 0.75rem 1.5rem;
          background: #252526;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          z-index: 20;
        }
        .tool-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .tool-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: #858585;
          letter-spacing: 0.1em;
        }
        .language-select {
          background: #3c3c3c;
          color: #cccccc;
          border: 1px solid #454545;
          padding: 0.35rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.85rem;
          outline: none;
          cursor: pointer;
        }
        .run-btn {
          margin-left: auto;
          background: #2ea043;
          color: white;
          border: none;
          padding: 0.4rem 1.25rem;
          border-radius: 0.25rem;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .run-btn:hover:not(:disabled) {
          background: #3fb950;
          transform: translateY(-1px);
        }
        .run-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .run-btn.running {
          background: #ca8a04;
        }
        .control-divider {
          width: 1px;
          height: 20px;
          background: rgba(255,255,255,0.1);
        }
        .editor-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          font-weight: 600;
          color: #858585;
          letter-spacing: 0.5px;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .status-dot.green {
          background: #6ee7b7;
          box-shadow: 0 0 8px #6ee7b7;
        }
        .main-editor-layout {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .editor-container {
          flex: 2;
          background: #1e1e1e;
          min-height: 0;
        }
        .output-panel {
          flex: 0.8;
          background: #000000;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          min-height: 150px;
        }
        .output-header {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 1.5rem;
          background: #1e1e1e;
          font-size: 0.65rem;
          font-weight: 800;
          color: #858585;
          letter-spacing: 0.1em;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .clear-output {
          background: none;
          border: none;
          color: #858585;
          font-size: 0.65rem;
          font-weight: 800;
          cursor: pointer;
        }
        .clear-output:hover { color: white; }
        .output-content {
          flex: 1;
          padding: 1rem 1.5rem;
          color: #cccccc;
          font-family: 'Fira Code', monospace;
          font-size: 0.9rem;
          overflow-y: auto;
          white-space: pre-wrap;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
