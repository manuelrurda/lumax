import { store as storeBugReport } from '@/actions/App/Http/Controllers/BugReportController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { toBlob } from 'html-to-image';
import { Bug, Lightbulb, Paperclip, X } from 'lucide-react';
import { useRef, useState } from 'react';

const MAX_ATTACHMENTS = 4;
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

interface BugReportForm {
    type: 'bug' | 'mejora';
    description: string;
    page_path: string;
    page_url: string;
    page_component: string;
    viewport: string;
    screenshot: File | null;
    attachments: File[];
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * "Reportar problema" button + dialog, mounted once in the app sidebar
 * footer so it is available on every authenticated page. On open it captures
 * a screenshot of the current page (without the dialog) and sends it along
 * with the page path, URL, Inertia component and viewport as context.
 */
export function BugReportDialog() {
    const page = usePage<SharedData>();
    const uploadsEnabled = page.props.bugReports?.uploadsEnabled ?? false;

    const [open, setOpen] = useState(false);
    const [capturing, setCapturing] = useState(false);
    const [captureFailed, setCaptureFailed] = useState(false);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
        null,
    );
    const [fileError, setFileError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<BugReportForm>({
        type: 'bug',
        description: '',
        page_path: '',
        page_url: '',
        page_component: '',
        viewport: '',
        screenshot: null,
        attachments: [],
    });

    const resetLocalState = () => {
        if (screenshotPreview) URL.revokeObjectURL(screenshotPreview);
        setScreenshotPreview(null);
        setCaptureFailed(false);
        setFileError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const openDialog = async () => {
        form.setData((data) => ({
            ...data,
            page_path: page.url,
            page_url: window.location.href,
            page_component: page.component ?? '',
            viewport: `${window.innerWidth}x${window.innerHeight}`,
        }));

        // Capture BEFORE opening the dialog so the dialog itself is not in
        // the screenshot. Skipped entirely when uploads are not configured.
        if (uploadsEnabled) {
            setCapturing(true);
            try {
                const blob = await toBlob(document.body, {
                    pixelRatio: 1,
                    quality: 0.8,
                    type: 'image/jpeg',
                    cacheBust: true,
                });
                if (blob) {
                    const file = new File([blob], 'captura-de-pantalla.jpg', {
                        type: 'image/jpeg',
                    });
                    form.setData('screenshot', file);
                    setScreenshotPreview(URL.createObjectURL(blob));
                } else {
                    setCaptureFailed(true);
                }
            } catch {
                setCaptureFailed(true);
            } finally {
                setCapturing(false);
            }
        }

        setOpen(true);
    };

    const removeScreenshot = () => {
        form.setData('screenshot', null);
        if (screenshotPreview) URL.revokeObjectURL(screenshotPreview);
        setScreenshotPreview(null);
    };

    const handleFilesSelected = (files: FileList | null) => {
        if (!files) return;
        setFileError(null);

        const accepted: File[] = [...form.data.attachments];
        for (const file of Array.from(files)) {
            const isImage = file.type.startsWith('image/');
            const isPdf = file.type === 'application/pdf';
            if (!isImage && !isPdf) {
                setFileError('Solo se permiten imágenes o archivos PDF.');
                continue;
            }
            if (file.size > MAX_FILE_SIZE) {
                setFileError('Cada archivo puede pesar máximo 8 MB.');
                continue;
            }
            if (accepted.length >= MAX_ATTACHMENTS) {
                setFileError(
                    `Puedes adjuntar máximo ${MAX_ATTACHMENTS} archivos.`,
                );
                break;
            }
            accepted.push(file);
        }

        form.setData('attachments', accepted);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeAttachment = (index: number) => {
        form.setData(
            'attachments',
            form.data.attachments.filter((_, i) => i !== index),
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(storeBugReport().url, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                form.reset();
                resetLocalState();
            },
        });
    };

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        onClick={openDialog}
                        disabled={capturing}
                        tooltip={{ children: 'Reportar problema' }}
                    >
                        <Bug className="w-4" />
                        <span>
                            {capturing ? 'Capturando…' : 'Reportar problema'}
                        </span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>

            <Dialog
                open={open}
                onOpenChange={(next) => {
                    setOpen(next);
                    if (!next) {
                        form.clearErrors();
                        resetLocalState();
                    }
                }}
            >
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Reportar un problema</DialogTitle>
                        <DialogDescription>
                            Cuéntanos qué pasó o qué mejora necesitas. El
                            reporte llega directo al equipo de desarrollo.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Tipo de reporte</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    variant={
                                        form.data.type === 'bug'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() => form.setData('type', 'bug')}
                                    className="justify-start"
                                >
                                    <Bug className="mr-2 h-4 w-4" />
                                    Error
                                </Button>
                                <Button
                                    type="button"
                                    variant={
                                        form.data.type === 'mejora'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() =>
                                        form.setData('type', 'mejora')
                                    }
                                    className="justify-start"
                                >
                                    <Lightbulb className="mr-2 h-4 w-4" />
                                    Mejora o función nueva
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bug-description">Descripción</Label>
                            <Textarea
                                id="bug-description"
                                value={form.data.description}
                                onChange={(e) =>
                                    form.setData('description', e.target.value)
                                }
                                placeholder="Describe el problema o la mejora que necesitas…"
                                rows={5}
                                autoFocus
                            />
                            <InputError message={form.errors.description} />
                        </div>

                        {uploadsEnabled ? (
                            <>
                                {screenshotPreview && (
                                    <div className="space-y-2">
                                        <Label>Captura de pantalla</Label>
                                        <div className="relative overflow-hidden rounded-md border">
                                            <img
                                                src={screenshotPreview}
                                                alt="Captura de la página actual"
                                                className="max-h-40 w-full object-cover object-top"
                                            />
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="secondary"
                                                className="absolute top-2 right-2 h-7 w-7"
                                                onClick={removeScreenshot}
                                                title="Quitar captura"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                {captureFailed && (
                                    <p className="text-sm text-muted-foreground">
                                        No se pudo capturar la pantalla; el
                                        reporte se enviará sin captura.
                                    </p>
                                )}

                                <div className="space-y-2">
                                    <Label>Archivos adjuntos (opcional)</Label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*,.pdf"
                                        multiple
                                        className="hidden"
                                        onChange={(e) =>
                                            handleFilesSelected(e.target.files)
                                        }
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        disabled={
                                            form.data.attachments.length >=
                                            MAX_ATTACHMENTS
                                        }
                                    >
                                        <Paperclip className="mr-2 h-4 w-4" />
                                        Adjuntar imagen o PDF
                                    </Button>
                                    <p className="text-xs text-muted-foreground">
                                        Máximo {MAX_ATTACHMENTS} archivos, 8 MB
                                        cada uno.
                                    </p>
                                    {form.data.attachments.length > 0 && (
                                        <ul className="space-y-1">
                                            {form.data.attachments.map(
                                                (file, i) => (
                                                    <li
                                                        key={`${file.name}-${i}`}
                                                        className="flex items-center justify-between rounded-md border px-3 py-1.5 text-sm"
                                                    >
                                                        <span className="truncate">
                                                            {file.name}{' '}
                                                            <span className="text-muted-foreground">
                                                                (
                                                                {formatBytes(
                                                                    file.size,
                                                                )}
                                                                )
                                                            </span>
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeAttachment(
                                                                    i,
                                                                )
                                                            }
                                                            className="ml-2 shrink-0 text-muted-foreground hover:text-foreground"
                                                            title="Quitar archivo"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    )}
                                    {fileError && (
                                        <p className="text-sm text-destructive">
                                            {fileError}
                                        </p>
                                    )}
                                    <InputError
                                        message={form.errors.attachments}
                                    />
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    Se enviará automáticamente: la página actual
                                    ({form.data.page_path || page.url}), una
                                    captura de pantalla y datos de tu navegador.
                                </p>
                            </>
                        ) : (
                            <p
                                className={cn(
                                    'rounded-md border border-dashed px-3 py-2',
                                    'text-xs text-muted-foreground',
                                )}
                            >
                                Los archivos adjuntos aún no están configurados
                                en este servidor; tu reporte se enviará sin
                                adjuntos y sin captura de pantalla. Sí se
                                incluirá la página actual ({page.url}).
                            </p>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                {form.processing
                                    ? 'Enviando…'
                                    : 'Enviar reporte'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
