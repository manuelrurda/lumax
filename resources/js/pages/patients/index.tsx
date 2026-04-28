import { DataPagination } from '@/components/common/data-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { ExternalLink, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CreatePatientDialog } from './ui/create-patient-dialog';
import { EditPatientDialog } from './ui/edit-patient-dialog';
import { TodaysAppointments } from './ui/todays-appointments';
import { PatientsSortSelect } from './ui/patients-sort-select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pacientes',
        href: '/patients',
    },
];

export default function PatientsPage() {
    const { patients, filters, todaysAppointments } = usePage<{
        patients: PaginatedData<Patient>;
        filters: { search?: string; sort?: string };
        todaysAppointments: any[];
    }>().props;
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [sortBy, setSortBy] = useState(
        typeof filters?.sort === 'string' ? filters.sort : 'latest',
    );

    const handleSortChange = (value: string) => {
        setSortBy(value);
        router.get(
            '/patients',
            { search: searchTerm, sort: value },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get(
                    '/patients',
                    { search: searchTerm, sort: sortBy },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                    },
                );
            }
        }, 800);

        return () => clearTimeout(timeout);
    }, [searchTerm, filters.search, sortBy]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pacientes" />

            <div className="flex h-full flex-1 flex-col p-6">
                <TodaysAppointments appointments={todaysAppointments} />

                <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="flex flex-1 items-center gap-4">
                        <PatientsSortSelect
                            value={sortBy}
                            onValueChange={handleSortChange}
                        />
                        <div className="relative flex-1">
                            <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar paciente..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <CreatePatientDialog />
                </div>

                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">
                                    Nombre
                                </TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>Correo electrónico</TableHead>
                                <TableHead>Última actualización</TableHead>
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
                                        No hay pacientes registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                patients.data.map((patient) => (
                                    <TableRow
                                        key={patient.id}
                                        className="cursor-pointer transition-colors hover:bg-muted/50"
                                        onClick={() =>
                                            router.get(
                                                `/patients/${patient.id}`,
                                            )
                                        }
                                    >
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
                                            {new Date(
                                                patient.updated_at,
                                            ).toLocaleDateString('es-MX', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div
                                                className="flex justify-end gap-2"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                    onClick={() =>
                                                        router.get(
                                                            `/patients/${patient.id}`,
                                                        )
                                                    }
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                                <EditPatientDialog
                                                    patient={patient}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
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
