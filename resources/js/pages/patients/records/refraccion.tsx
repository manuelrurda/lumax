import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { RefraccionFormTab } from './forms/refraccion-form';
import { PatientRecordLayout } from './patient-record-layout';
import { PatientRefraccionTab } from './schemas/refraccion';

export default function PatientRefraccion({
    patient,
}: {
    patient: PatientRefraccionTab;
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
            <Head title={`Refraccción: ${patient.first_name}`} />

            <PatientRecordLayout
                patient={patient}
                currentTab="refraccion"
            >
                <RefraccionFormTab patient={patient} />
            </PatientRecordLayout>
        </AppLayout>
    );
}
