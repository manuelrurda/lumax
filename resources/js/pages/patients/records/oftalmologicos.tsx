import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AntecedentesOftalmologicosFormTab } from './forms/antecedentes-oftalmologicos-form';
import { PatientRecordLayout } from './patient-record-layout';
import { PatientOftalmologicosTab } from './schemas/antecedentes-oftalmologicos';

export default function PatientOftalmologicos({
    patient,
}: {
    patient: PatientOftalmologicosTab;
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
            <Head
                title={`Antecedentes Oftalmológicos: ${patient.first_name}`}
            />

            <PatientRecordLayout patient={patient} currentTab="oftalmologicos">
                <AntecedentesOftalmologicosFormTab patient={patient} />
            </PatientRecordLayout>
        </AppLayout>
    );
}
