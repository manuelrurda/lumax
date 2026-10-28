import { DataPagination } from '@/components/common/data-pagination';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedData, type Patient } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ArchiveRestore, ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pacientes',
        href: '/patients',
    },
    {
        title: 'Archivados',
        href: '/patients/archived',
    },
];

export default function ArchivedPatientsPage() {
    const { patients } = usePage<{
        patients: PaginatedData<Patient>;
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pacientes archivados" />

            <div className="flex h-full flex-1 flex-col p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <h1 className="text-xl font-semibold">
                        Pacientes archivados
                    </h1>
                    <Button
                        variant="outline"
                        onClick={() => router.get('/patients')}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a pacientes
                    </Button>
                </div>

                <p className="mb-4 text-sm text-muted-foreground">
                    Los pacientes archivados no aparecen en la lista ni en las
                    búsquedas, pero su expediente e historial se conservan y
                    pueden restaurarse en cualquier momento.
                </p>

                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">
                                    Nombre
                                </TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>Correo electrónico</TableHead>
                                <TableHead>Fecha de archivo</TableHead>
                                <TableHead className="text-right">
                                    Acciones
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patients.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No hay pacientes archivados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                patients.data.map((patient) => (
                                    <TableRow key={patient.id}>
                                        <TableCell className="font-medium">
                                            {patient.first_name}{' '}
                                            {patient.last_name}
                                        </TableCell>
                                        <TableCell>
                                            {patient.phone || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {patient.email || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {patient.deleted_at
                                                ? new Date(
                                                      patient.deleted_at,
                                                  ).toLocaleDateString(
                                                      'es-MX',
                                                      {
                                                          year: 'numeric',
                                                          month: 'short',
                                                          day: 'numeric',
                                                      },
                                                  )
                                                : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    router.post(
                                                        `/patients/${patient.id}/restore`,
                                                    )
                                                }
                                            >
                                                <ArchiveRestore className="h-4 w-4" />
                                                Restaurar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DataPagination data={patients} />
            </div>
        </AppLayout>
    );
}
