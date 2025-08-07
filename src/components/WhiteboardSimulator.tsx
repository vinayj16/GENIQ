import React, { useState, useRef, useEffect } from 'react';
import { Pen, Square, Circle, Type, Eraser, Undo, Redo, Download, Share, Trash2, Settings, Grid } from 'lucide-react';

interface WhiteboardSimulatorProps {
  problemType: 'algorithm' | 'system-design';
  onSave?: (canvas: string) => void;
  collaborative?: boolean;
}

interface DrawingTool {
  type: 'pen' | 'rectangle' | 'circle' | 'text' | 'eraser' | 'move';
  color: string;
  size: number;
}

interface DrawingElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  strokeWidth: number;
  text?: string;
  points?: { x: number; y: number }[];
}

const WhiteboardSimulator: React.FC<WhiteboardSimulatorProps> = ({
  problemType,
  onSave,
  collaborative = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<DrawingTool>({
    type: 'pen',
    color: '#000000',
    size: 2
  });
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [history, setHistory] = useState<DrawingElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];
  
  const algorithmTemplates = [
    { name: 'Tree Structure', icon: '🌳' },
    { name: 'Graph', icon: '🕸️' },
    { name: 'Array Visualization', icon: '📊' },
    { name: 'Algorithm Flow', icon: '🔄' }
  ];

  const systemDesignTemplates = [
    { name: 'Basic Architecture', icon: '🏗️' },
    { name: 'Database Design', icon: '🗄️' },
    { name: 'API Design', icon: '🔌' },
    { name: 'Microservices', icon: '🔧' }
  ];

  const templates = problemType === 'algorithm' ? algorithmTemplates : systemDesignTemplates;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Draw all elements
    elements.forEach(element => {
      drawElement(ctx, element);
    });
  }, [elements, showGrid]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    const gridSize = 20;
    
    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawElement = (ctx: CanvasRenderingContext2D, element: DrawingElement) => {
    ctx.strokeStyle = element.color;
    ctx.fillStyle = element.color;
    ctx.lineWidth = element.strokeWidth;

    switch (element.type) {
      case 'pen':
        if (element.points && element.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          element.points.forEach(point => {
            ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
        }
        break;
      
      case 'rectangle':
        ctx.beginPath();
        ctx.rect(element.x, element.y, element.width || 0, element.height || 0);
        ctx.stroke();
        break;
      
      case 'circle': {
        const radius = Math.sqrt(Math.pow(element.width || 0, 2) + Math.pow(element.height || 0, 2)) / 2;
        ctx.beginPath();
        ctx.arc(element.x + (element.width || 0) / 2, element.y + (element.height || 0) / 2, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      }
      
      case 'text':
        ctx.font = `${element.strokeWidth * 8}px Arial`;
        ctx.fillText(element.text || '', element.x, element.y);
        break;
    }
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    
    const newElement: DrawingElement = {
      id: Date.now().toString(),
      type: currentTool.type,
      x: pos.x,
      y: pos.y,
      color: currentTool.color,
      strokeWidth: currentTool.size,
      points: currentTool.type === 'pen' ? [pos] : undefined
    };

    if (currentTool.type === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        newElement.text = text;
        setElements(prev => [...prev, newElement]);
        addToHistory([...elements, newElement]);
      }
      setIsDrawing(false);
      return;
    }

    setElements(prev => [...prev, newElement]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const pos = getMousePos(e);
    
    setElements(prev => {
      const newElements = [...prev];
      const currentElement = newElements[newElements.length - 1];
      
      if (currentTool.type === 'pen') {
        currentElement.points = [...(currentElement.points || []), pos];
      } else if (currentTool.type === 'rectangle' || currentTool.type === 'circle') {
        currentElement.width = pos.x - currentElement.x;
        currentElement.height = pos.y - currentElement.y;
      }
      
      return newElements;
    });
  };

  const stopDrawing = () => {
    if (isDrawing) {
      addToHistory(elements);
      setIsDrawing(false);
    }
  };

  const addToHistory = (newElements: DrawingElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
    }
  };

  const clearCanvas = () => {
    setElements([]);
    addToHistory([]);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `whiteboard-${problemType}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const loadTemplate = (templateName: string) => {
    // Mock template loading - in real implementation, this would load predefined shapes
    const templateElements: DrawingElement[] = [];
    
    if (templateName === 'Tree Structure') {
      // Add tree nodes
      templateElements.push({
        id: 'root',
        type: 'circle',
        x: 300,
        y: 50,
        width: 60,
        height: 60,
        color: '#3B82F6',
        strokeWidth: 2
      });
      templateElements.push({
        id: 'left-child',
        type: 'circle',
        x: 200,
        y: 150,
        width: 60,
        height: 60,
        color: '#3B82F6',
        strokeWidth: 2
      });
      templateElements.push({
        id: 'right-child',
        type: 'circle',
        x: 400,
        y: 150,
        width: 60,
        height: 60,
        color: '#3B82F6',
        strokeWidth: 2
      });
    } else if (templateName === 'Basic Architecture') {
      // Add architecture components
      templateElements.push({
        id: 'client',
        type: 'rectangle',
        x: 50,
        y: 100,
        width: 100,
        height: 60,
        color: '#10B981',
        strokeWidth: 2
      });
      templateElements.push({
        id: 'server',
        type: 'rectangle',
        x: 250,
        y: 100,
        width: 100,
        height: 60,
        color: '#F59E0B',
        strokeWidth: 2
      });
      templateElements.push({
        id: 'database',
        type: 'rectangle',
        x: 450,
        y: 100,
        width: 100,
        height: 60,
        color: '#EF4444',
        strokeWidth: 2
      });
    }
    
    setElements(templateElements);
    addToHistory(templateElements);
    setSelectedTemplate(templateName);
    setShowTemplates(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Drawing Tools */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentTool({ ...currentTool, type: 'pen' })}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool.type === 'pen' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                title="Pen Tool"
              >
                <Pen className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setCurrentTool({ ...currentTool, type: 'rectangle' })}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool.type === 'rectangle' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                title="Rectangle Tool"
              >
                <Square className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setCurrentTool({ ...currentTool, type: 'circle' })}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool.type === 'circle' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                title="Circle Tool"
              >
                <Circle className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setCurrentTool({ ...currentTool, type: 'text' })}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool.type === 'text' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                title="Text Tool"
              >
                <Type className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setCurrentTool({ ...currentTool, type: 'eraser' })}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool.type === 'eraser' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                title="Eraser Tool"
              >
                <Eraser className="w-5 h-5" />
              </button>
            </div>

            {/* Colors */}
            <div className="flex items-center space-x-1">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setCurrentTool({ ...currentTool, color })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    currentTool.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Color: ${color}`}
                />
              ))}
            </div>

            {/* Brush Size */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Size:</span>
              <input
                type="range"
                min="1"
                max="10"
                value={currentTool.size}
                onChange={(e) => setCurrentTool({ ...currentTool, size: parseInt(e.target.value) })}
                className="w-20"
              />
              <span className="text-sm text-gray-600 w-6">{currentTool.size}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* History Controls */}
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <Undo className="w-5 h-5" />
            </button>
            
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo"
            >
              <Redo className="w-5 h-5" />
            </button>

            {/* Utility Controls */}
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-lg transition-colors ${
                showGrid ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Toggle Grid"
            >
              <Grid className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Templates"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={clearCanvas}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Clear Canvas"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <button
              onClick={downloadCanvas}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>

            {collaborative && (
              <button
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Share"
              >
                <Share className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Templates Panel */}
        {showTemplates && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              {problemType === 'algorithm' ? 'Algorithm Templates' : 'System Design Templates'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {templates.map(template => (
                <button
                  key={template.name}
                  onClick={() => loadTemplate(template.name)}
                  className={`p-3 text-center border rounded-lg transition-colors hover:bg-gray-50 ${
                    selectedTemplate === template.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{template.icon}</div>
                  <div className="text-xs text-gray-700">{template.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-96 cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        
        {collaborative && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Live collaboration enabled</span>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Tool: {currentTool.type}</span>
            <span>Color: {currentTool.color}</span>
            <span>Size: {currentTool.size}px</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Elements: {elements.length}</span>
            {selectedTemplate && <span>Template: {selectedTemplate}</span>}
            <span>Grid: {showGrid ? 'On' : 'Off'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardSimulator;