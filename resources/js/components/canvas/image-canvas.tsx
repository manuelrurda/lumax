import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useRef, useState } from 'react';
import { Image as KonvaImage, Layer, Line, Stage, Arrow, Text } from 'react-konva';
import useImage from 'use-image';
import { Toolbar } from './toolbar';
import { ZoomControls } from './zoom-controls';

export interface CanvasShape {
    type: string;
    points?: number[];
    x?: number;
    y?: number;
    text?: string;
    color?: string;
}

interface ImageCanvasProps {
    backgroundImageUrl: string;
    className?: string;
    /**
     * Shapes to render when the canvas first mounts (issue #5). Read once:
     * afterwards the canvas owns the drawing state (including undo/redo
     * history) and reports every change through onChange.
     */
    initialShapes?: CanvasShape[];
    /** Called with the full, JSON-safe shape list whenever it changes. */
    onChange?: (shapes: CanvasShape[]) => void;
    /**
     * Read-only rendering (e.g. historical snapshot views): no drawing,
     * no text editing, no toolbar. Pan/zoom controls stay available.
     */
    readOnly?: boolean;
}

export default function ImageCanvas({
    backgroundImageUrl,
    className = '',
    initialShapes,
    onChange,
    readOnly = false,
}: ImageCanvasProps) {
    const [image] = useImage(backgroundImageUrl);

    // Container sizing
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Pan and Zoom state
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [baseScale, setBaseScale] = useState(1);
    const [basePosition, setBasePosition] = useState({ x: 0, y: 0 });

    // Drawing state
    const [tool, setTool] = useState('select');
    const [color, setColor] = useState('#1e293b');

    // History State for Undo/Redo
    const [history, setHistory] = useState<CanvasShape[][]>(() => [
        initialShapes ?? [],
    ]);
    const [step, setStep] = useState(0);
    const isDrawing = useRef(false);

    // Report shape changes to the parent (controlled persistence, #5).
    // A ref keeps the latest callback without re-running on re-renders.
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // Text editing state
    const [editingTextIndex, setEditingTextIndex] = useState<number | null>(null);

    // Derived current shapes
    const shapes = history[step];

    useEffect(() => {
        if (!readOnly) {
            onChangeRef.current?.(shapes);
        }
    }, [shapes, readOnly]);

    // Undo / Redo Handlers
    const handleUndo = () => {
        if (editingTextIndex !== null) {
            setEditingTextIndex(null);
        }
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleRedo = () => {
        if (editingTextIndex !== null) {
            setEditingTextIndex(null);
        }
        if (step < history.length - 1) {
            setStep(step + 1);
        }
    };

    // Keyboard shortcuts for Undo/Redo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (readOnly) return;
            // Don't trigger undo/redo if typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                if (e.shiftKey) {
                    handleRedo();
                } else {
                    handleUndo();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [step, history]);

    // Resize observer
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Initial fit
    useEffect(() => {
        if (image && dimensions.width > 0 && dimensions.height > 0) {
            const containerRatio = dimensions.width / dimensions.height;
            const imageRatio = image.width / image.height;
            let fitScale = 1;
            if (containerRatio > imageRatio) {
                fitScale = dimensions.height / image.height;
            } else {
                fitScale = dimensions.width / image.width;
            }
            const x = (dimensions.width - image.width * fitScale) / 2;
            const y = (dimensions.height - image.height * fitScale) / 2;

            setBaseScale(fitScale);
            setBasePosition({ x, y });
            setScale(fitScale);
            setPosition({ x, y });
        }
    }, [image, dimensions.width, dimensions.height]);

    // Clamps the position so the image never leaves the canvas bounds
    const clampPosition = (pos: { x: number; y: number }, currentScale: number) => {
        if (!image) return pos;

        const imgW = image.width * currentScale;
        const imgH = image.height * currentScale;
        const stageW = dimensions.width;
        const stageH = dimensions.height;

        let x = pos.x;
        let y = pos.y;

        if (imgW < stageW) {
            // Image is narrower than stage. Keep it within stage bounds.
            x = Math.max(0, Math.min(x, stageW - imgW));
        } else {
            // Image is wider than stage. No empty space allowed.
            x = Math.min(0, Math.max(x, stageW - imgW));
        }

        if (imgH < stageH) {
            // Image is shorter than stage. Keep it within stage bounds.
            y = Math.max(0, Math.min(y, stageH - imgH));
        } else {
            // Image is taller than stage. No empty space allowed.
            y = Math.min(0, Math.max(y, stageH - imgH));
        }

        return { x, y };
    };

    // Zoom Button Handlers
    const handleZoomIn = () => {
        const scaleBy = 1.2;
        const newScale = scale * scaleBy;
        const maxScale = baseScale * 5;
        const clampedScale = Math.min(newScale, maxScale);

        const center = { x: dimensions.width / 2, y: dimensions.height / 2 };
        const mousePointTo = {
            x: (center.x - position.x) / scale,
            y: (center.y - position.y) / scale,
        };
        const newPos = {
            x: center.x - mousePointTo.x * clampedScale,
            y: center.y - mousePointTo.y * clampedScale,
        };

        setScale(clampedScale);
        setPosition(clampPosition(newPos, clampedScale));
    };

    const handleZoomOut = () => {
        const scaleBy = 1.2;
        const newScale = scale / scaleBy;
        const minScale = baseScale * 0.5;
        const clampedScale = Math.max(newScale, minScale);

        const center = { x: dimensions.width / 2, y: dimensions.height / 2 };
        const mousePointTo = {
            x: (center.x - position.x) / scale,
            y: (center.y - position.y) / scale,
        };
        const newPos = {
            x: center.x - mousePointTo.x * clampedScale,
            y: center.y - mousePointTo.y * clampedScale,
        };

        setScale(clampedScale);
        setPosition(clampPosition(newPos, clampedScale));
    };

    const handleResetZoom = () => {
        setScale(baseScale);
        setPosition(basePosition);
    };

    // Handle Wheel for Zooming and Panning
    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = e.target.getStage();
        if (!stage) return;
        
        if (editingTextIndex !== null) {
            setEditingTextIndex(null);
        }

        // If Ctrl or Meta (Cmd) is pressed, we zoom
        if (e.evt.ctrlKey || e.evt.metaKey) {
            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();
            if (!pointer) return;

            const scaleBy = 1.05;
            // deltaY can be positive or negative. Determine zoom direction.
            const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
            const minScale = baseScale * 0.5;
            const maxScale = baseScale * 5;
            const clampedScale = Math.max(minScale, Math.min(newScale, maxScale));

            const mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale,
            };

            const newPos = {
                x: pointer.x - mousePointTo.x * clampedScale,
                y: pointer.y - mousePointTo.y * clampedScale,
            };

            setScale(clampedScale);
            setPosition(clampPosition(newPos, clampedScale));
        } else {
            // Normal scroll -> Panning
            setPosition((prevPosition) => 
                clampPosition({
                    x: prevPosition.x - e.evt.deltaX,
                    y: prevPosition.y - e.evt.deltaY,
                }, scale)
            );
        }
    };

    // Drawing Handlers
    const handleMouseDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (readOnly) return;
        // If clicking on an empty area while editing text, blur handles closing it.
        // We only start a new action if not clicking the stage while another thing is active.
        if (tool !== 'line' && tool !== 'arrow') return;
        isDrawing.current = true;

        const stage = e.target.getStage();
        if (!stage) return;
        const pos = stage.getRelativePointerPosition();
        if (!pos) return;

        // Push a new shape to the active history step
        const newShapes = [...shapes, { type: tool, points: [pos.x, pos.y, pos.x, pos.y], color: color }];

        // We throw away any "future" history if we draw after undoing
        const newHistory = history.slice(0, step + 1);
        newHistory.push(newShapes);

        setHistory(newHistory);
        setStep(newHistory.length - 1);
    };

    const handleMouseMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!isDrawing.current || (tool !== 'line' && tool !== 'arrow')) return;

        const stage = e.target.getStage();
        if (!stage) return;

        const pos = stage.getRelativePointerPosition();
        if (!pos) return;

        // Check for Cmd key (metaKey), Shift key, or Ctrl key
        const isStraight = e.evt.metaKey || e.evt.shiftKey || e.evt.ctrlKey;

        // Update the last shape's end point in the CURRENT step
        setHistory((prevHistory) => {
            const newHistory = [...prevHistory];
            const currentShapes = [...newHistory[step]];

            if (currentShapes.length === 0) return prevHistory;

            const lastShape = { ...currentShapes[currentShapes.length - 1] };
            let endX = pos.x;
            let endY = pos.y;

            if (isStraight && lastShape.points) {
                const startX = lastShape.points[0];
                const startY = lastShape.points[1];
                const dx = pos.x - startX;
                const dy = pos.y - startY;

                const angle = Math.atan2(dy, dx);
                // Snap angle to nearest 45 degrees (PI / 4 radians)
                const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
                const distance = Math.hypot(dx, dy);

                endX = startX + distance * Math.cos(snapAngle);
                endY = startY + distance * Math.sin(snapAngle);
            }

            lastShape.points = [
                lastShape.points?.[0] ?? 0,
                lastShape.points?.[1] ?? 0,
                endX,
                endY,
            ];

            currentShapes[currentShapes.length - 1] = lastShape;
            newHistory[step] = currentShapes;
            return newHistory;
        });
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };
    
    // Handle text creation on click to avoid mouseup focus stealing
    const handleClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (readOnly) return;
        if (tool === 'text' && editingTextIndex === null) {
            const stage = e.target.getStage();
            if (!stage) return;
            const pos = stage.getRelativePointerPosition();
            if (!pos) return;

            const newShapes = [...shapes, { type: 'text', x: pos.x, y: pos.y, text: '', color: color }];
            const newHistory = history.slice(0, step + 1);
            newHistory.push(newShapes);
            
            setHistory(newHistory);
            setStep(newHistory.length - 1);
            
            // Small timeout ensures the browser finishes the click event cycle before we mount and focus the input
            setTimeout(() => {
                setEditingTextIndex(newShapes.length - 1);
            }, 10);
        }
    };
    
    // Double click to edit existing text
    const handleTextDblClick = (index: number) => {
        if (readOnly) return;
        if (tool === 'select' || tool === 'text') {
            setTimeout(() => {
                setEditingTextIndex(index);
            }, 10);
        }
    };

    const zoomPercentage = baseScale > 0 ? Math.round((scale / baseScale) * 100) : 100;

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
        >
            {!image && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50 font-medium text-slate-400">
                    Loading canvas...
                </div>
            )}

            {image && dimensions.width > 0 && dimensions.height > 0 && (
                <>
                    <Stage
                        width={dimensions.width}
                        height={dimensions.height}
                        scaleX={scale}
                        scaleY={scale}
                        x={position.x}
                        y={position.y}
                        onWheel={handleWheel}
                        draggable={tool === 'select' && editingTextIndex === null && !readOnly} // Only allow panning when in select mode and not editing text
                        dragBoundFunc={(pos) => clampPosition(pos, scale)}
                        onDragEnd={(e) => {
                            if (e.target === e.target.getStage() && tool === 'select') {
                                setPosition({
                                    x: e.target.x(),
                                    y: e.target.y(),
                                });
                            }
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onTouchStart={handleMouseDown}
                        onTouchMove={handleMouseMove}
                        onTouchEnd={handleMouseUp}
                        onClick={handleClick}
                        onTap={handleClick}
                        className={
                            tool === 'select'
                                ? 'cursor-grab active:cursor-grabbing'
                                : tool === 'text' 
                                    ? 'cursor-text'
                                    : 'cursor-crosshair'
                        }
                    >
                        <Layer>
                            {/* Background Image Layer */}
                            <KonvaImage image={image} />
                        </Layer>

                        {/* Drawing Layer */}
                        <Layer>
                            {shapes.map((shape, i) => {
                                // If this text is currently being edited, hide the canvas node so they don't overlap awkwardly
                                if (i === editingTextIndex) {
                                    return null;
                                }
                                
                                if (shape.type === 'text') {
                                    return (
                                        <Text
                                            key={i}
                                            x={shape.x}
                                            y={shape.y}
                                            text={shape.text}
                                            fill={shape.color || "#1e293b"}
                                            fontSize={24 / scale}
                                            fontFamily="Inter, sans-serif"
                                            draggable={tool === 'select' && !readOnly}
                                            onDragStart={(e) => {
                                                e.cancelBubble = true;
                                            }}
                                            onDragEnd={(e) => {
                                                e.cancelBubble = true;
                                                const newX = e.target.x();
                                                const newY = e.target.y();
                                                setHistory((prevHistory) => {
                                                    const newHistory = [...prevHistory];
                                                    const currentShapes = [...newHistory[step]];
                                                    currentShapes[i] = {
                                                        ...currentShapes[i],
                                                        x: newX,
                                                        y: newY,
                                                    };
                                                    newHistory[step] = currentShapes;
                                                    return newHistory;
                                                });
                                            }}
                                            onDblClick={() => handleTextDblClick(i)}
                                            onDblTap={() => handleTextDblClick(i)}
                                        />
                                    );
                                }
                                
                                if (shape.type === 'arrow') {
                                    return (
                                        <Arrow
                                            key={i}
                                            points={shape.points ?? []}
                                            stroke={shape.color || "#ef4444"}
                                            fill={shape.color || "#ef4444"}
                                            strokeWidth={4 / scale}
                                            pointerLength={15 / scale}
                                            pointerWidth={15 / scale}
                                            tension={0.5}
                                            lineCap="round"
                                            lineJoin="round"
                                        />
                                    );
                                }
                                
                                return (
                                    <Line
                                        key={i}
                                        points={shape.points ?? []}
                                        stroke={shape.color || "#ef4444"}
                                        strokeWidth={4 / scale}
                                        tension={0.5}
                                        lineCap="round"
                                        lineJoin="round"
                                    />
                                );
                            })}
                        </Layer>
                    </Stage>
                    
                    {/* HTML Overlay for Text Editing */}
                    {editingTextIndex !== null && shapes[editingTextIndex] && (
                        <input
                            autoFocus
                            className="absolute bg-transparent outline-hidden border border-dashed border-slate-400 p-0 m-0 z-20"
                            style={{
                                top: (shapes[editingTextIndex].y ?? 0) * scale + position.y,
                                left: (shapes[editingTextIndex].x ?? 0) * scale + position.x,
                                color: shapes[editingTextIndex].color,
                                fontSize: `${24}px`, // visual size on screen is fixed at 24px (24/scale * scale)
                                fontFamily: "Inter, sans-serif",
                                lineHeight: 1,
                                // min width so you can click it when empty
                                minWidth: '20px', 
                            }}
                            value={shapes[editingTextIndex].text}
                            onChange={(e) => {
                                const newText = e.target.value;
                                setHistory(prev => {
                                    const newHistory = [...prev];
                                    const currentShapes = [...newHistory[step]];
                                    currentShapes[editingTextIndex] = {
                                        ...currentShapes[editingTextIndex],
                                        text: newText
                                    };
                                    newHistory[step] = currentShapes;
                                    return newHistory;
                                });
                            }}
                            onBlur={() => {
                                // If the text is empty on blur, remove the shape entirely from this step
                                if (!shapes[editingTextIndex].text?.trim()) {
                                    setHistory(prev => {
                                        const newHistory = [...prev];
                                        const currentShapes = [...newHistory[step]];
                                        currentShapes.splice(editingTextIndex, 1);
                                        newHistory[step] = currentShapes;
                                        return newHistory;
                                    });
                                }
                                setEditingTextIndex(null);
                                setTool('select');
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.currentTarget.blur(); // Blur triggers save & close
                                }
                            }}
                        />
                    )}

                    {!readOnly && (
                        <Toolbar
                            tool={tool}
                            setTool={setTool}
                            color={color}
                            setColor={setColor}
                            onUndo={handleUndo}
                            onRedo={handleRedo}
                            canUndo={step > 0}
                            canRedo={step < history.length - 1}
                        />
                    )}

                    <ZoomControls
                        zoomPercentage={zoomPercentage}
                        onZoomIn={handleZoomIn}
                        onZoomOut={handleZoomOut}
                        onResetZoom={handleResetZoom}
                    />
                </>
            )}
        </div>
    );
}
