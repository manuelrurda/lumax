import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ZoomControlsProps {
    zoomPercentage: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
}

export const ZoomControls = ({
    zoomPercentage,
    onZoomIn,
    onZoomOut,
    onResetZoom,
}: ZoomControlsProps) => {
    return (
        <TooltipProvider delayDuration={200}>
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-x-1 rounded-xl bg-white p-1.5 shadow-lg border border-slate-200/60">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={onZoomOut}
                            className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-600"
                        >
                            <ZoomOut className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={10}>
                        Alejar (Zoom Out)
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={onResetZoom}
                            className="px-2 py-1 rounded hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-600 min-w-[50px] text-center"
                        >
                            {zoomPercentage}%
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={10}>
                        Restablecer Zoom (100%)
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={onZoomIn}
                            className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-600"
                        >
                            <ZoomIn className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={10}>
                        Acercar (Zoom In)
                    </TooltipContent>
                </Tooltip>

                <div className="w-px h-4 bg-slate-200 mx-0.5" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={onResetZoom}
                            className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-600"
                        >
                            <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={10}>
                        Restablecer vista
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
};
