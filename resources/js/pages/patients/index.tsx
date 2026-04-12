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
import { Head, usePage } from '@inertiajs/react';
import { ExternalLink, Search, Trash2 } from 'lucide-react';
import { CreatePatientDialog } from './ui/create-patient-dialog';
import { EditPatientDialog } from './ui/edit-patient-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pacientes',
        href: '/patients',
    },
];

export default function PatientsPage() {
    const { patients } = usePage<{ patients: PaginatedData<Patient> }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pacientes" />

            <div className="flex h-full flex-1 flex-col p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Pacientes</h1>
                    <p className="text-sm text-muted-foreground">
                        Gestión de registros de pacientes
                    </p>
                </div>

                <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar paciente..."
                            className="pl-8"
                        />
                    </div>
                    <CreatePatientDialog />
                </div>

                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Nombre</TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>Correo electrónico</TableHead>
                                <TableHead>Última actualización</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patients.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No hay pacientes registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                patients.data.map((patient) => (
                                    <TableRow key={patient.id}>
                                        <TableCell className="font-medium">
                                            {patient.first_name} {patient.last_name}
                                        </TableCell>
                                        <TableCell>{patient.phone || '-'}</TableCell>
                                        <TableCell>{patient.email || '-'}</TableCell>
                                        <TableCell>
                                            {new Date(patient.updated_at).toLocaleDateString('es-MX', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                                <EditPatientDialog patient={patient} />
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

                <div className="mt-4 text-sm text-muted-foreground">
                    Mostrando {patients.from || 0} a {patients.to || 0} de {patients.total} registros
                </div>
            </div>
        </AppLayout>
    );
}
