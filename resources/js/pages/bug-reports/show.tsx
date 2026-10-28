import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type BugReport } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Bug, ExternalLink, Lightbulb } from 'lucide-react';

const statusLabels: Record<string, string> = {
    nuevo: 'Nuevo',
    en_progreso: 'En progreso',
    resuelto: 'Resuelto',
    descartado: 'Descartado',
};

function formatBytes(bytes: number | null): string {
    if (bytes === null) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ContextRow({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    if (value === null || value === undefined || value === '') return null;
    return (
        <div className="grid grid-cols-3 gap-2 py-2">
            <dt className="text-sm font-medium text-muted-foreground">
                {label}
            </dt>
            <dd className="col-span-2 text-sm break-all">{value}</dd>
        </div>
    );
}

export default function BugReportShow() {
    const { report } = usePage<{ report: BugReport }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reportes', href: '/bug-reports' },
        { title: `#${report.id}`, href: `/bug-reports/${report.id}` },
    ];

    const screenshot = report.attachments?.find((a) => a.kind === 'screenshot');
    const files =
        report.attachments?.filter((a) => a.kind === 'attachment') ?? [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Reporte #${report.id}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <Button variant="ghost" size="sm" asChild className="-ml-2">
                        <Link href="/bug-reports">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Volver a reportes
                        </Link>
                    </Button>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-lumax-purple">
                            {report.title}
                        </h1>
                        {report.type === 'bug' ? (
                            <Badge variant="destructive">
                                <Bug className="mr-1 h-3 w-3" />
                                Error
                            </Badge>
                        ) : (
                            <Badge variant="secondary">
                                <Lightbulb className="mr-1 h-3 w-3" />
                                Mejora
                            </Badge>
                        )}
                        <Badge variant="outline">
                            {statusLabels[report.status] ?? report.status}
                        </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Reportado por{' '}
                        {report.user?.first_name ?? report.user?.email ?? '—'}{' '}
                        el{' '}
                        {new Date(report.created_at).toLocaleString('es-MX', {
                            dateStyle: 'long',
                            timeStyle: 'short',
                        })}
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Descripción</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm whitespace-pre-wrap">
                            {report.description}
                        </p>
                    </CardContent>
                </Card>

                {screenshot && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Captura de pantalla</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <a
                                href={screenshot.file_url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    src={screenshot.file_url}
                                    alt="Captura de pantalla del reporte"
                                    className="max-h-[480px] w-auto rounded-md border"
                                />
                            </a>
                            <p className="mt-2 text-xs text-muted-foreground">
                                {screenshot.file_name}{' '}
                                {screenshot.file_size !== null &&
                                    `· ${formatBytes(screenshot.file_size)}`}{' '}
                                — clic para ver en tamaño completo.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {files.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Archivos adjuntos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {files.map((file) => (
                                    <li key={file.id}>
                                        {file.file_type?.startsWith(
                                            'image/',
                                        ) ? (
                                            <a
                                                href={file.file_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block"
                                            >
                                                <img
                                                    src={file.file_url}
                                                    alt={file.file_name}
                                                    className="max-h-64 w-auto rounded-md border"
                                                />
                                                <span className="mt-1 block text-xs text-muted-foreground">
                                                    {file.file_name}
                                                </span>
                                            </a>
                                        ) : (
                                            <a
                                                href={file.file_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-sm text-lumax-purple hover:underline"
                                            >
                                                {file.file_name}
                                                {file.file_size !== null &&
                                                    ` (${formatBytes(file.file_size)})`}
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Contexto técnico</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="divide-y">
                            <ContextRow
                                label="Página"
                                value={report.page_path}
                            />
                            <ContextRow
                                label="URL completa"
                                value={report.page_url}
                            />
                            <ContextRow
                                label="Componente"
                                value={report.page_component}
                            />
                            <ContextRow
                                label="Tamaño de ventana"
                                value={report.viewport}
                            />
                            <ContextRow
                                label="Navegador"
                                value={report.user_agent}
                            />
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
