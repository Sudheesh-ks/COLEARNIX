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

import "./CodeEditor.css";

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

    </div>
  );
}
