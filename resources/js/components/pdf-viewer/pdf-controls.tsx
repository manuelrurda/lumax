import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoveLeft, MoveRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PDFControls {
    pageNum: number | undefined;
    numPages: number | null;
    changePage: (offset: number) => void;
    setPageNum: (page: number) => void;
    scale: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
}
const PDFControls = ({
    pageNum,
    numPages,
    changePage,
    setPageNum,
    scale,
    onZoomIn,
    onZoomOut,
}: PDFControls) => {
    const [inputValue, setInputValue] = useState<string>(String(pageNum ?? 1));
    useEffect(() => {
        setInputValue(String(pageNum));
    }, [pageNum]);

    const commitPageValue = () => {
        const page = parseInt(inputValue);
        if (!isNaN(page) && numPages && page > 0 && page <= numPages) {
            setPageNum(page);
        } else {
            setInputValue(String(pageNum));
        }
    };

    return (
        <div className="bg-gray-500">
            <div className="flex w-full items-center justify-between p-2">
                <div className="flex items-center gap-2">
                    <div className="[&>*]:h-6 [&>*]:cursor-pointer [&>*]:bg-gray-200 [&>*]:text-black [&>*]:hover:bg-gray-300">
                        <Button
                            size="sm"
                            onClick={() => changePage(-1)}
                            type="button"
                        >
                            <MoveLeft />
                        </Button>
                        <Button
                            size="sm"
                            className="ml-2"
                            onClick={() => changePage(1)}
                            type="button"
                        >
                            <MoveRight />
                        </Button>
                    </div>
                    <div className="ml-4 flex items-center gap-2 border-l border-gray-400 pl-2">
                        <div className="[&>*]:h-6 [&>*]:cursor-pointer [&>*]:bg-gray-200 [&>*]:text-black [&>*]:hover:bg-gray-300">
                            <Button
                                size="sm"
                                onClick={onZoomOut}
                                type="button"
                                disabled={scale <= 0.5}
                            >
                                <ZoomOut />
                            </Button>
                            <Button
                                size="sm"
                                className="ml-2"
                                onClick={onZoomIn}
                                type="button"
                                disabled={scale >= 3.0}
                            >
                                <ZoomIn />
                            </Button>
                        </div>
                        <span className="text-xs text-white">
                            {Math.round(scale * 100)}%
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-white">
                    <Input
                        type="number"
                        value={inputValue}
                        className="h-6 max-w-[70px] justify-center border-none bg-white text-black"
                        onChange={(event) => {
                            setInputValue(event.target.value);
                        }}
                        onBlur={commitPageValue}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                commitPageValue();
                                event.currentTarget.blur();
                            }
                        }}
                    />
                    / {numPages}
                </div>
            </div>
        </div>
    );
};

export default PDFControls;
