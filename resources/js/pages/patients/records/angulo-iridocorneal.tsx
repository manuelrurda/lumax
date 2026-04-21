import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AnguloIridocornealFormTab } from './forms/angulo-iridocorneal-form';
import { PatientRecordLayout } from './patient-record-layout';
import { PatientAnguloIridocornealTab } from './schemas/angulo-iridocorneal';

export default function PatientAnguloIridocorneal({
    patient,
}: {
    patient: PatientAnguloIridocornealTab;
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
            <Head title={`Ángulo Iridocorneal: ${patient.first_name}`} />

            <PatientRecordLayout
                patient={patient}
                currentTab="angulo-iridocorneal"
            >
                <AnguloIridocornealFormTab patient={patient} />
            </PatientRecordLayout>
        </AppLayout>
    );
}
