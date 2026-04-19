import AppLayout from '@/layouts/app-layout';
import { Patient, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { PatientRecordLayout } from './patient-record-layout';

export default function PatientEstrabograma({
    patient,
}: {
    patient: Patient;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Pacientes', href: '/patients' },
        {
            title: `${patient.first_name} ${patient.last_name}`,
            href: `/patients/${patient.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Estrabograma: ${patient.first_name}`} />

            <PatientRecordLayout
                patient={patient}
                currentTab="estrabograma"
            >
                <div></div>
            </PatientRecordLayout>
        </AppLayout>
    );
}
