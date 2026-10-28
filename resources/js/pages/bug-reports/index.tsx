import { DataPagination } from '@/components/common/data-pagination';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type BugReport,
    type PaginatedData,
} from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Bug, Lightbulb, Paperclip } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reportes',
        href: '/bug-reports',
    },
];

const statusLabels: Record<string, string> = {
    nuevo: 'Nuevo',
    en_progreso: 'En progreso',
    resuelto: 'Resuelto',
    descartado: 'Descartado',
};

export default function BugReportsIndex() {
    const { reports } = usePage<{
        reports: PaginatedData<BugReport>;
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportes" />

            <div className="flex h-full flex-1 flex-col p-6">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold tracking-tight text-lumax-purple">
                        Reportes
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Problemas y mejoras reportados desde la aplicación.
                    </p>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Título</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Reportado por</TableHead>
                                <TableHead>Página</TableHead>
                                <TableHead>Adjuntos</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Fecha</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        Todavía no hay reportes. Usa el botón
                                        «Reportar problema» en el menú lateral
                                        para enviar el primero.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reports.data.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell className="max-w-[280px]">
                                            <Link
                                                href={`/bug-reports/${report.id}`}
                                                className="block truncate font-medium text-lumax-purple hover:underline"
                                                title={report.title}
                                            >
                                                {report.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
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
                                        </TableCell>
                                        <TableCell>
                                            {report.user?.first_name ??
                                                report.user?.email ??
                                                '—'}
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                                            {report.page_path}
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                                                <Paperclip className="h-3.5 w-3.5" />
                                                {report.attachments_count ?? 0}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {statusLabels[report.status] ??
                                                    report.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-muted-foreground">
                                            {new Date(
                                                report.created_at,
                                            ).toLocaleString('es-MX', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DataPagination data={reports as PaginatedData<unknown>} />
            </div>
        </AppLayout>
    );
}
