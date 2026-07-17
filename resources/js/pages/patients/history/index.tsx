import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Patient } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Eye, Plus, Activity } from 'lucide-react';

interface ActivityLog {
    id: number;
    description: string;
    event: string;
    created_at: string;
    attribute_changes?: {
        attributes?: Record<string, any>;
        old?: Record<string, any>;
    };
}

export default function PatientHistoryPage() {
    const { patient, records, showAll } = usePage<{
        patient: Patient;
        records: ActivityLog[];
        showAll: boolean;
    }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pacientes',
            href: '/patients',
        },
        {
            title: `${patient.first_name} ${patient.last_name}`,
            href: `/patients/${patient.id}`,
        },
        {
            title: 'Historial',
            href: `/patients/${patient.id}`,
        },
    ];

    const getModifiedFields = (record: ActivityLog) => {
        if (!record.attribute_changes?.attributes) return 'Modificaciones generales';
        const keys = Object.keys(record.attribute_changes.attributes);
        const labels: Record<string, string> = {
            antecedentes: 'Antecedentes',
            antecedentes_oftalmologicos: 'Ant. Oftalmológicos',
            exploracion_fisica: 'Exploración Física',
            estrabograma: 'Estrabograma',
            refraccion: 'Refracción',
        };
        return keys.map(k => labels[k] || k).join(', ');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Historial - ${patient.first_name}`} />

            <div className="flex h-full flex-1 flex-col p-6">
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Historial Clínico de {patient.first_name} {patient.last_name}
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Consulte las versiones anteriores del expediente de este paciente. Las versiones cumplen con la NOM-024.
                        </p>
                    </div>
                    
                    <Button 
                        onClick={() => router.get(`/patients/${patient.id}/antecedentes`)}
                        className="bg-lumax-purple hover:bg-lumax-purple/90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva consulta
                    </Button>
                </div>

                <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="flex flex-1 items-center gap-4">
                        <Select
                            value={showAll ? 'all' : 'daily'}
                            onValueChange={(value) => 
                                router.get(`/patients/${patient.id}`, { show_all: value === 'all' }, { preserveState: true, preserveScroll: true, replace: true })
                            }
                        >
                            <SelectTrigger className="w-[300px]">
                                <SelectValue placeholder="Nivel de detalle" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Mostrar último guardado por día</SelectItem>
                                <SelectItem value="all">Mostrar todo el historial granular</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">Fecha</TableHead>
                                <TableHead>Hora</TableHead>
                                <TableHead>Evento</TableHead>
                                <TableHead>Secciones Modificadas</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {records.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No hay historial registrado para este paciente.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                records.map((record) => {
                                    const date = new Date(record.created_at);
                                    return (
                                        <TableRow key={record.id} className="group">
                                            <TableCell className="font-medium">
                                                {date.toLocaleDateString('es-MX', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {date.toLocaleTimeString('es-MX', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                                    <span className="capitalize">{record.event === 'updated' ? 'Actualización' : record.event}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                                                    {getModifiedFields(record)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled
                                                    className="opacity-50"
                                                    title="Próximamente: ver registro en modo solo lectura"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Ver Detalle
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
