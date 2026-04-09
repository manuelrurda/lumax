import { Loader2, QrCodeIcon, XIcon } from 'lucide-react';
import { ResizeDirection } from 're-resizable';
import { useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PageCallback } from 'react-pdf/dist/shared/types.js';
import {
    DraggableData,
    Position,
    ResizableDelta,
    Rnd,
    RndDragEvent,
} from 'react-rnd';
import PDFControls from './pdf-controls';

// Required for react-pdf to work
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface QRSignature {
    page: number;
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
}

interface PDFViewer {
    file: File | string;
    containerRef: React.RefObject<HTMLDivElement | null>;
    onPageLoadSucess?: (pageHeightPx: number) => void;
    onPageClick?: (e: React.MouseEvent) => void;
    enableQRSignature?: boolean; // Flag to enable QR signature functionality
    onQRSignatureChange?: (signature: QRSignature | null) => void; // Callback to change the QR signature
}

const PDFViewer = ({
    file,
    containerRef,
    onPageLoadSucess = () => {},
    onPageClick = () => {},
    enableQRSignature = false,
    onQRSignatureChange = () => {},
}: PDFViewer) => {
    const [containerHeight, setContainerHeight] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNum, setPageNum] = useState<number>(1);
    const [qrSignature, setQrSignature] = useState<QRSignature | null>(null);
    const [scale, setScale] = useState<number>(1.0);
    const pageRef = useRef<HTMLDivElement>(null);
    const isResizing = useRef<boolean>(false);

    const ZOOM_MIN = 0.5;
    const ZOOM_MAX = 3.0;
    const ZOOM_STEP = 0.1;

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        const container = containerRef.current;
        if (!container) return;
        setContainerHeight(container.clientHeight - 110);
        setNumPages(numPages);
        setIsLoading(false);
        setPageNum(1);
    };

    const handlePageChangeInternal = (newPage: number) => {
        if (enableQRSignature && qrSignature && qrSignature.page !== newPage) {
            setQrSignature(null);
            onQRSignatureChange(null);
        }
    };

    const changePage = (offset: number) => {
        setPageNum((prev) => {
            let newPage = prev;
            if (
                prev &&
                numPages &&
                prev + offset > 0 &&
                prev + offset <= numPages
            ) {
                newPage = prev + offset;
            }
            handlePageChangeInternal(newPage);
            return newPage;
        });
    };

    const handleQRPageClick = (e: React.MouseEvent) => {
        if (!enableQRSignature || isResizing.current) {
            onPageClick(e);
            return;
        }

        const pageElement = pageRef.current;
        if (!pageElement) {
            onPageClick(e);
            return;
        }

        const rect = pageElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const pageWidth = rect.width;
        const pageHeight = rect.height;

        let qrWidth: number;
        let qrHeight: number;

        if (!qrSignature) {
            qrWidth = 80;
            qrHeight = 80;
        } else {
            qrWidth = Number(qrSignature.size.width);
            qrHeight = Number(qrSignature.size.height);
        }

        const maxQrX = Math.max(0, pageWidth - qrWidth);
        const maxQrY = Math.max(0, pageHeight - qrHeight);

        const clampedX = Math.min(x, maxQrX);
        const clampedY = Math.min(y, maxQrY);

        const newSignature: QRSignature = {
            page: pageNum ?? 0,
            size: {
                width: qrWidth,
                height: qrHeight,
            },
            position: {
                x: clampedX,
                y: clampedY,
            },
        };

        setQrSignature(newSignature);
        onQRSignatureChange(newSignature);
        onPageClick(e);
    };

    const handleQRDragStop = (e: RndDragEvent, d: DraggableData) => {
        if (!enableQRSignature) return;

        const pageElement = pageRef.current;
        if (!pageElement) return;

        const pageWidth = pageElement.clientWidth;
        const pageHeight = pageElement.clientHeight;
        const qrWidth = Number(qrSignature?.size.width ?? 80);
        const qrHeight = Number(qrSignature?.size.height ?? 80);

        const maxQrX = Math.max(0, pageWidth - qrWidth);
        const maxQrY = Math.max(0, pageHeight - qrHeight);

        const clampedX = Math.min(Math.max(0, d.x), maxQrX);
        const clampedY = Math.min(Math.max(0, d.y), maxQrY);

        const updated: QRSignature = {
            page: qrSignature?.page ?? pageNum,
            position: {
                x: clampedX,
                y: clampedY,
            },
            size: qrSignature?.size ?? { width: 80, height: 80 },
        };

        setQrSignature(updated);
        onQRSignatureChange(updated);
    };

    const handleQRResizeStop = (
        _e: MouseEvent | TouchEvent,
        _direction: ResizeDirection,
        ref: HTMLElement,
        _delta: ResizableDelta,
        position: Position,
    ) => {
        if (!enableQRSignature) return;

        const pageElement = pageRef.current;
        if (!pageElement) return;

        const pageWidth = pageElement.clientWidth;
        const pageHeight = pageElement.clientHeight;

        const newWidth = parseInt(ref.style.width, 10);
        const newHeight = parseInt(ref.style.height, 10);

        const maxQrX = Math.max(0, pageWidth - newWidth);
        const maxQrY = Math.max(0, pageHeight - newHeight);

        const clampedX = Math.min(Math.max(0, position.x), maxQrX);
        const clampedY = Math.min(Math.max(0, position.y), maxQrY);

        const updated: QRSignature = {
            page: qrSignature?.page ?? pageNum,
            position: {
                x: clampedX,
                y: clampedY,
            },
            size: {
                width: newWidth,
                height: newHeight,
            },
        };

        setQrSignature(updated);
        onQRSignatureChange(updated);
        setTimeout(() => {
            isResizing.current = false;
        }, 100);
    };

    const handlePageLoadSuccess = (page: PageCallback) => {
        // Get the actual rendered height in CSS pixels from the page element
        // This is needed because the backend expects rendered pixel height to calculate ratio
        if (pageRef.current) {
            const renderedHeight =
                pageRef.current.getBoundingClientRect().height;
            onPageLoadSucess(renderedHeight);
        } else {
            onPageLoadSucess(page.height * scale);
        }
    };

    const handleZoomIn = () => {
        const newScale = Math.min(scale + ZOOM_STEP, ZOOM_MAX);
        setScale(newScale);
    };

    const handleZoomOut = () => {
        const newScale = Math.max(scale - ZOOM_STEP, ZOOM_MIN);
        setScale(newScale);
    };

    return (
        <div className="flex h-full w-full flex-col bg-gray-200">
            {!isLoading && (
                <div className="w-full flex-shrink-0">
                    <PDFControls
                        pageNum={pageNum}
                        numPages={numPages}
                        changePage={changePage}
                        setPageNum={(page: number) => {
                            setPageNum(page);
                            handlePageChangeInternal(page);
                        }}
                        scale={scale}
                        onZoomIn={handleZoomIn}
                        onZoomOut={handleZoomOut}
                    />
                </div>
            )}

            <div
                className="relative no-scrollbar flex min-h-0 flex-1 overflow-auto"
                style={{ maxHeight: containerHeight || '100%' }}
            >
                <div
                    className="mx-auto w-min"
                    style={{ minHeight: containerHeight || undefined }}
                >
                    <Document
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<PDFViewerLoading />}
                    >
                        <div
                            className="relative"
                            ref={pageRef}
                            onClick={
                                enableQRSignature
                                    ? handleQRPageClick
                                    : onPageClick
                            }
                        >
                            <Page
                                className="bg-gray-200"
                                pageNumber={pageNum}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                                height={containerHeight}
                                scale={scale}
                                onLoadSuccess={handlePageLoadSuccess}
                                loading={<PDFViewerLoading />}
                            />
                            {enableQRSignature &&
                                qrSignature &&
                                qrSignature.page === pageNum && (
                                    <div className="pointer-events-none absolute inset-0">
                                        <Rnd
                                            lockAspectRatio
                                            size={qrSignature.size}
                                            position={qrSignature.position}
                                            onDragStop={handleQRDragStop}
                                            onResizeStop={handleQRResizeStop}
                                            onResizeStart={() => {
                                                isResizing.current = true;
                                            }}
                                            bounds="parent"
                                            style={{
                                                border: '2px dashed #ccc',
                                                zIndex: 10,
                                                background: 'transparent',
                                                pointerEvents: 'auto',
                                            }}
                                            onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            <div className="bg-amber-500">
                                                <div>
                                                    <XIcon
                                                        onClick={(
                                                            e: React.MouseEvent,
                                                        ) => {
                                                            setQrSignature(
                                                                null,
                                                            );
                                                            onQRSignatureChange(
                                                                null,
                                                            );
                                                            e.stopPropagation();
                                                        }}
                                                        className="absolute right-0 z-50 h-4 w-4 cursor-pointer rounded-full bg-red-500 text-white opacity-80 hover:opacity-100"
                                                    />
                                                </div>
                                                <QrCodeIcon className="h-full w-full bg-white text-black" />
                                            </div>
                                        </Rnd>
                                    </div>
                                )}
                        </div>
                    </Document>
                </div>
            </div>
        </div>
    );
};

const PDFViewerLoading = () => {
    return (
        <div className="flex items-center justify-center border-none p-8">
            <Loader2 className="h-12 w-12 animate-spin text-unam-gold" />
        </div>
    );
};

export default PDFViewer;
