import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ExploracionFisicaFormTab } from './forms/exploracion-fisica-form';
import { PatientRecordLayout } from './patient-record-layout';
import { PatientExploracionFisicaTab } from './schemas/exploracion-fisica';

export default function PatientExploracionFisica({
    patient,
}: {
    patient: PatientExploracionFisicaTab;
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
            <Head title={`Exploración Física: ${patient.first_name}`} />

            <PatientRecordLayout
                patient={patient}
                currentTab="exploracion-fisica"
            >
                <ExploracionFisicaFormTab patient={patient} />
            </PatientRecordLayout>
        </AppLayout>
    );
}
