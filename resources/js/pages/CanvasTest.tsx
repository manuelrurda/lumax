import { Head } from '@inertiajs/react';
import ImageCanvas from '../components/canvas/image-canvas';

export default function CanvasTest() {
    // Example background: a generic medical/anatomical placeholder
    const backgroundImageUrl =
        'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1000&auto=format&fit=crop';

    return (
        <>
            <Head title="Image Canvas Base Test" />

            <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-100 font-sans">
                {/* Header */}
                <header className="z-20 flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-800">
                            Canvas Base Layout
                        </h1>
                        <p className="text-sm text-slate-500">
                            Ready for custom tool implementation
                        </p>
                    </div>
                </header>

                {/* Main Workspace */}
                <main className="flex h-full w-full flex-1 items-center justify-center p-8">
                    {/* The canvas container dictates the size via CSS classes */}
                    <ImageCanvas
                        backgroundImageUrl={backgroundImageUrl}
                        className="h-full max-h-[800px] w-full max-w-5xl rounded-xl border border-slate-200/60 bg-white shadow-xl"
                    />
                </main>
            </div>
        </>
    );
}
