import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AntecedentesTab } from './forms/antecedentes-form';
import { PatientRecordLayout } from './patient-record-layout';
import { PatientAntecedentesTab } from './schemas/antecedentes';

export default function PatientAntecedentes({
    patient,
}: {
    patient: PatientAntecedentesTab;
}) {
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
                <AntecedentesTab patient={patient} />
            </PatientRecordLayout>
        </AppLayout>
    );
}
