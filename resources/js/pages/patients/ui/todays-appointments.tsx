import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Patient } from '@/types';
import { router } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { EditPatientDialog } from './edit-patient-dialog';

interface TodaysAppointmentsProps {
    appointments: {
        id: number;
        starts_at: string;
        patient: Patient;
    }[];
}

export function TodaysAppointments({ appointments }: TodaysAppointmentsProps) {
    return (
        <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold">Citas próximas</h2>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Nombre</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Correo electrónico</TableHead>
                            <TableHead>Hora cita</TableHead>
                            <TableHead className="text-right">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!appointments || appointments.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="py-8 text-center text-muted-foreground"
                                >
                                    No hay citas programadas para el resto del
                                    día.
                                </TableCell>
                            </TableRow>
                        ) : (
                            appointments.map((appointment) => {
                                const patient = appointment.patient;
                                if (!patient) return null;
                                const appointmentTime = new Date(
                                    appointment.starts_at,
                                ).toLocaleTimeString('es-MX', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                });

                                return (
                                    <TableRow
                                        key={appointment.id}
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
                                        <TableCell className="font-semibold">
                                            {appointmentTime}
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
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
