import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Patient } from '@/types';
import { Head } from '@inertiajs/react';

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
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Expediente de {patient.first_name} {patient.last_name}</h1>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <p className="text-muted-foreground">Los detalles y antecedentes del paciente se mostrarán aquí.</p>
                </div>
            </div>
        </AppLayout>
    );
}
