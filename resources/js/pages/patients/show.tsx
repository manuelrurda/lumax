import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Patient } from '@/types';
import { Head } from '@inertiajs/react';
import { PatientProfileLayout } from './ui/patient-profile-layout';

export default function PatientShow({ patient }: { patient: Patient }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pacientes',
            href: '/patients',
        },
        {
            title: `${patient.first_name} ${patient.last_name}`,
            href: `/patients/${patient.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Expediente: ${patient.first_name}`} />
            
            <PatientProfileLayout patient={patient} currentTab="info">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Datos Personales</h2>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <span className="font-medium text-muted-foreground mr-2">Nombres:</span> 
                                {patient.first_name}
                            </li>
                            <li>
                                <span className="font-medium text-muted-foreground mr-2">Apellidos:</span> 
                                {patient.last_name}
                            </li>
                            <li>
                                <span className="font-medium text-muted-foreground mr-2">Teléfono:</span> 
                                {patient.phone || '-'}
                            </li>
                            <li>
                                <span className="font-medium text-muted-foreground mr-2">Correo:</span> 
                                {patient.email || '-'}
                            </li>
                        </ul>
                    </div>
                </div>
            </PatientProfileLayout>
        </AppLayout>
    );
}
