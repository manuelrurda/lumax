import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Patient } from '@/types';
import { Head } from '@inertiajs/react';
import { PatientRecordLayout } from './ui/patient-record-layout';
import { AntecedentesNoPatologicosTab } from './ui/antecedentes-no-patologicos-form';

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
            
            <PatientRecordLayout patient={patient} currentTab="info">
                <AntecedentesNoPatologicosTab patient={patient} />
            </PatientRecordLayout>
        </AppLayout>
    );
}
