import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { PatientRecordLayout } from './ui/patient-record-layout';
import { PatientAntecedentesTab } from './schemas/antecedentes-form';

export default function PatientOftalmologicos({ patient }: { patient: PatientAntecedentesTab }) {
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
            <Head title={`Antecedentes Oftalmológicos: ${patient.first_name}`} />
            
            <PatientRecordLayout patient={patient} currentTab="oftalmologicos">
                <div className="space-y-8 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h2 className="text-xl font-semibold">
                            Antecedentes Oftalmológicos
                        </h2>
                    </div>
                    <div className="text-muted-foreground text-sm">
                        En construcción...
                    </div>
                </div>
            </PatientRecordLayout>
        </AppLayout>
    );
}
