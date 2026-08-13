import { MousePointer2, Minus, ArrowUpRight, Type, Undo2, Redo2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface ToolbarProps {
    tool: string;
    setTool: (tool: string) => void;
    color: string;
    setColor: (color: string) => void;
    onUndo?: () => void;
    onRedo?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
}

const COLORS = [
    '#ef4444', // Red
    '#3b82f6', // Blue
    '#22c55e', // Green
    '#eab308', // Yellow
    '#1e293b', // Slate/Black
];

export const Toolbar = ({ tool, setTool, color, setColor, onUndo, onRedo, canUndo = false, canRedo = false }: ToolbarProps) => {
    
    const ToolButton = ({ 
        icon: Icon, 
        label, 
        isActive, 
        onClick, 
        disabled 
    }: { 
        icon: any, 
        label: string, 
        isActive?: boolean, 
        onClick?: () => void, 
        disabled?: boolean 
    }) => (
        <Tooltip>
            <TooltipTrigger asChild>
                <button 
                    onClick={onClick}
                    disabled={disabled}
                    className={`p-2 rounded hover:bg-slate-100 transition-colors ${
                        isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'
                    } ${disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''}`}
                >
                    <Icon className="w-5 h-5" strokeWidth={2.5} />
                </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={14}>
                {label}
            </TooltipContent>
        </Tooltip>
    );

    return (
        <TooltipProvider delayDuration={200}>
            <div className="absolute top-[50%] left-4 flex -translate-y-[50%] flex-col gap-y-4 z-10">
                <div className="flex flex-col items-center gap-y-1 rounded-xl bg-white p-1.5 shadow-lg border border-slate-200/60">
                    <ToolButton 
                        icon={MousePointer2} 
                        label="Select" 
                        isActive={tool === 'select'} 
                        onClick={() => setTool('select')} 
                    />
                    <ToolButton 
                        icon={Minus} 
                        label="Line" 
                        isActive={tool === 'line'} 
                        onClick={() => setTool('line')} 
                    />
                    <ToolButton 
                        icon={ArrowUpRight} 
                        label="Arrow" 
                        isActive={tool === 'arrow'} 
                        onClick={() => setTool('arrow')} 
                    />
                    <ToolButton 
                        icon={Type} 
                        label="Text" 
                        isActive={tool === 'text'} 
                        onClick={() => setTool('text')} 
                    />
                    
                    <div className="w-6 h-px bg-slate-200 my-1" />
                    
                    <Popover>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <PopoverTrigger asChild>
                                    <button className="p-2 rounded hover:bg-slate-100 transition-colors flex items-center justify-center">
                                        <div 
                                            className="w-5 h-5 rounded-full border border-slate-200 shadow-sm"
                                            style={{ backgroundColor: color }}
                                        />
                                    </button>
                                </PopoverTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={14}>
                                Color
                            </TooltipContent>
                        </Tooltip>
                        
                        <PopoverContent side="right" sideOffset={14} className="w-auto p-2 flex gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                                        color === c ? 'border-indigo-500 scale-110' : 'border-transparent'
                                    }`}
                                    style={{ backgroundColor: c }}
                                    aria-label={`Select color ${c}`}
                                />
                            ))}
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-col items-center gap-y-1 rounded-xl bg-white p-1.5 shadow-lg border border-slate-200/60">
                    <ToolButton 
                        icon={Undo2} 
                        label="Deshacer" 
                        onClick={onUndo} 
                        disabled={!canUndo} 
                    />
                    <ToolButton 
                        icon={Redo2} 
                        label="Rehacer" 
                        onClick={onRedo} 
                        disabled={!canRedo} 
                    />
                </div>
            </div>
        </TooltipProvider>
    );
};
