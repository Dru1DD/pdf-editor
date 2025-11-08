"use client";

import { useState, useRef, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { motion } from "framer-motion";
import {
  Upload,
  Save,
  StickyNote,
  X,
  Pencil,
  Type,
  MousePointer2,
} from "lucide-react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { toast } from "react-toastify";

type Tool = "note" | "pencil" | "text";

interface Note {
  id: number;
  x: number;
  y: number;
  text: string;
}

interface Drawing {
  id: number;
  points: Array<{ x: number; y: number }>;
  color: string;
  strokeWidth: number;
}

interface TextElement {
  id: number;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
}

export default function EditorPage() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [currentTool, setCurrentTool] = useState<Tool>("note");
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawing, setCurrentDrawing] = useState<Drawing | null>(null);
  const [editingTextId, setEditingTextId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || f.type !== "application/pdf") return;
    const url = URL.createObjectURL(f);
    setFile(f);
    setFileUrl(url);
    setNotes([]);
    setDrawings([]);
    setTextElements([]);
  };

  const handleAddNote = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentTool !== "note") return;
    const container = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - container.left;
    const y = e.clientY - container.top;
    const text = prompt("input note:");
    if (text) setNotes((prev) => [...prev, { id: Date.now(), x, y, text }]);
  };

  const handleDeleteNote = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const getCanvasCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool !== "pencil" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const { x, y } = getCanvasCoordinates(e, canvas);

    setIsDrawing(true);
    const newDrawing: Drawing = {
      id: Date.now(),
      points: [{ x, y }],
      color: "#6366f1",
      strokeWidth: 2,
    };
    setCurrentDrawing(newDrawing);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const { x, y } = getCanvasCoordinates(e, canvas);

    const updatedDrawing = {
      ...currentDrawing,
      points: [...currentDrawing.points, { x, y }],
    };
    setCurrentDrawing(updatedDrawing);

    const ctx = canvas.getContext("2d");
    if (ctx && updatedDrawing.points.length > 1) {
      const prevPoint = updatedDrawing.points[updatedDrawing.points.length - 2];
      ctx.strokeStyle = updatedDrawing.color;
      ctx.lineWidth = updatedDrawing.strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentDrawing) {
      setDrawings((prev) => [...prev, currentDrawing!]);
      setCurrentDrawing(null);
    }
    setIsDrawing(false);
  };

  const handleAddText = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentTool !== "text") return;
    const container = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - container.left;
    const y = e.clientY - container.top;
    const text = prompt("Input text:");
    if (text) {
      const newText: TextElement = {
        id: Date.now(),
        x,
        y,
        text,
        fontSize: 14,
        color: "#ffffff",
      };
      setTextElements((prev) => [...prev, newText]);
      setEditingTextId(newText.id);
    }
  };

  const handleEditText = (id: number) => {
    setEditingTextId(id);
  };

  const handleUpdateText = (id: number, newText: string) => {
    setTextElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, text: newText } : el))
    );
    setEditingTextId(null);
  };

  const handleDeleteText = (id: number) => {
    setTextElements((prev) => prev.filter((el) => el.id !== id));
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawings.forEach((drawing) => {
      if (drawing.points.length < 2) return;
      ctx.strokeStyle = drawing.color;
      ctx.lineWidth = drawing.strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
      for (let i = 1; i < drawing.points.length; i++) {
        ctx.lineTo(drawing.points[i].x, drawing.points[i].y);
      }
      ctx.stroke();
    });

    if (currentDrawing && currentDrawing.points.length > 1) {
      ctx.strokeStyle = currentDrawing.color;
      ctx.lineWidth = currentDrawing.strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(currentDrawing.points[0].x, currentDrawing.points[0].y);
      for (let i = 1; i < currentDrawing.points.length; i++) {
        ctx.lineTo(currentDrawing.points[i].x, currentDrawing.points[i].y);
      }
      ctx.stroke();
    }
  }, [drawings, currentDrawing]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [fileUrl]);

  const handleExport = async () => {
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      pdf.registerFontkit(fontkit);

      const fontBytes = await fetch("/fonts/Roboto-Regular.ttf").then((r) =>
        r.arrayBuffer()
      );
      const customFont = await pdf.embedFont(fontBytes);

      const page = pdf.getPage(0);
      const { width: pdfWidth, height: pdfHeight } = page.getSize();
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const pdfCanvas = containerRef.current?.querySelector(
        "canvas"
      ) as HTMLCanvasElement;

      let scaleX = pdfWidth / containerRect.width;
      let scaleY = pdfHeight / containerRect.height;

      if (pdfCanvas) {
        const pdfCanvasRect = pdfCanvas.getBoundingClientRect();
        scaleX = pdfWidth / pdfCanvasRect.width;
        scaleY = pdfHeight / pdfCanvasRect.height;
      }

      for (const note of notes) {
        const x = note.x * scaleX;
        const y = pdfHeight - note.y * scaleY;
        const fontSize = 12;
        const padding = 8;
        const borderRadius = 6;

        const textWidth = customFont.widthOfTextAtSize(note.text, fontSize);
        const textHeight = fontSize;
        const boxWidth = textWidth + padding * 2;
        const boxHeight = textHeight + padding * 2;

        const bgColor = rgb(0.39, 0.41, 0.95);

        page.drawRectangle({
          x: x,
          y: y - boxHeight,
          width: boxWidth,
          height: boxHeight,
          color: bgColor,
          opacity: 0.9,
          borderWidth: 0,
        });

        page.drawText(note.text, {
          x: x + padding,
          y: y - boxHeight + padding + textHeight * 0.25,
          size: fontSize,
          color: rgb(0, 0, 0),
          font: customFont,
        });
      }

      for (const drawing of drawings) {
        if (drawing.points.length < 2) continue;

        const color = rgb(0.39, 0.41, 0.95);
        const strokeWidth = Math.max(1, drawing.strokeWidth * scaleX);

        for (let i = 1; i < drawing.points.length; i++) {
          const prevPoint = drawing.points[i - 1];
          const currentPoint = drawing.points[i];

          const startX = prevPoint.x * scaleX;
          const startY = pdfHeight - prevPoint.y * scaleY;
          const endX = currentPoint.x * scaleX;
          const endY = pdfHeight - currentPoint.y * scaleY;

          const distance = Math.sqrt(
            Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
          );
          const steps = Math.max(3, Math.floor(distance / (strokeWidth / 2)));

          for (let step = 0; step <= steps; step++) {
            const t = step / steps;
            const x = startX + (endX - startX) * t;
            const y = startY + (endY - startY) * t;

            page.drawCircle({
              x,
              y,
              size: strokeWidth / 2,
              color: color,
            });
          }
        }
      }

      for (const textEl of textElements) {
        const textColor = rgb(0, 0, 0);

        const x = textEl.x * scaleX;
        const y = pdfHeight - textEl.y * scaleY;
        const fontSize = Math.max(8, textEl.fontSize * scaleX);

        page.drawText(textEl.text, {
          x,
          y,
          size: fontSize,
          color: textColor,
          font: customFont,
        });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "edited.pdf";
      a.click();
      URL.revokeObjectURL(url);
      toast("Successfull export");
    } catch (err) {
      console.error("Export error:", err);
      toast("Error while exporting PDF", { type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center p-6">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
      >
        PDF Editor
      </motion.h1>

      {!fileUrl && (
        <div
          className="border-2 border-dashed border-neutral-700 rounded-2xl w-full max-w-xl p-12 text-center cursor-pointer hover:border-indigo-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-10 h-10 mx-auto text-neutral-400 mb-3" />
          <p className="text-neutral-400 mb-2">Click to upload a PDF file</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      )}

      {fileUrl && (
        <div className="w-full max-w-4xl">
          <div className="flex gap-2 mb-4 justify-center">
            <button
              onClick={() => setCurrentTool("note")}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                currentTool === "note"
                  ? "bg-indigo-500 text-white"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              <MousePointer2 className="w-4 h-4" />
              Notes
            </button>
            <button
              onClick={() => setCurrentTool("pencil")}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                currentTool === "pencil"
                  ? "bg-indigo-500 text-white"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              <Pencil className="w-4 h-4" />
              Pen
            </button>
            <button
              onClick={() => setCurrentTool("text")}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                currentTool === "text"
                  ? "bg-indigo-500 text-white"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              <Type className="w-4 h-4" />
              Text
            </button>
          </div>

          <div
            ref={containerRef}
            className="relative border border-neutral-800 rounded-lg overflow-hidden w-full h-[80vh]"
          >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <div
                className="relative w-full h-full"
                style={{
                  cursor:
                    currentTool === "pencil"
                      ? "crosshair"
                      : currentTool === "text"
                      ? "text"
                      : "pointer",
                }}
                onClick={
                  currentTool === "note"
                    ? handleAddNote
                    : currentTool === "text"
                    ? handleAddText
                    : undefined
                }
              >
                <Viewer
                  fileUrl={fileUrl}
                  plugins={[defaultLayoutPluginInstance]}
                />

                {/* Canvas для рисования */}
                {currentTool === "pencil" && (
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-auto"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  />
                )}

                {/* Заметки */}
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="absolute bg-indigo-500/80 text-xs rounded-md px-2 py-1 flex items-center gap-1 z-10"
                    style={{ top: note.y, left: note.x }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <StickyNote className="w-3 h-3" />
                    {note.text}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="hover:bg-indigo-600 rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Текстовые элементы */}
                {textElements.map((textEl) => (
                  <div
                    key={textEl.id}
                    className="absolute z-10"
                    style={{
                      top: textEl.y,
                      left: textEl.x,
                      fontSize: `${textEl.fontSize}px`,
                      color: textEl.color,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentTool === "text") {
                        handleEditText(textEl.id);
                      }
                    }}
                  >
                    {editingTextId === textEl.id ? (
                      <input
                        type="text"
                        value={textEl.text}
                        onChange={(e) => {
                          setTextElements((prev) =>
                            prev.map((el) =>
                              el.id === textEl.id
                                ? { ...el, text: e.target.value }
                                : el
                            )
                          );
                        }}
                        onBlur={() => handleUpdateText(textEl.id, textEl.text)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUpdateText(textEl.id, textEl.text);
                          }
                          if (e.key === "Escape") {
                            setEditingTextId(null);
                          }
                        }}
                        autoFocus
                        className="bg-indigo-500/90 text-white px-2 py-1 rounded border border-indigo-400 outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="relative group">
                        <span className="bg-indigo-500/80 px-2 py-1 rounded">
                          {textEl.text}
                        </span>
                        {currentTool === "text" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteText(textEl.id);
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Worker>
          </div>
        </div>
      )}

      {fileUrl && (
        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={() => {
              setFile(null);
              setFileUrl(null);
              setNotes([]);
              setDrawings([]);
              setTextElements([]);
            }}
            className="px-6 py-3 border border-neutral-700 text-neutral-300 hover:border-indigo-500 rounded-lg transition-colors"
          >
            Choose another PDF
          </button>
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Export PDF ({notes.length +
              drawings.length +
              textElements.length}{" "}
            elements)
          </button>
        </div>
      )}
    </div>
  );
}
