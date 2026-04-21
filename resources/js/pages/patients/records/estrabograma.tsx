import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { EstrabogramaFormTab } from './forms/estrabograma-form';
import { PatientRecordLayout } from './patient-record-layout';
import { PatientEstrabogramaTab } from './schemas/estrabograma';

export default function PatientEstrabograma({
    patient,
}: {
    patient: PatientEstrabogramaTab;
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
                <EstrabogramaFormTab patient={patient} />
            </PatientRecordLayout>
        </AppLayout>
    );
}

