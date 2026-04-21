import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ExploracionOftalmologicaFormTab } from './forms/exploracion-oftalmologica-form';
import { PatientRecordLayout } from './patient-record-layout';
import { PatientExploracionOftalmologicaTab } from './schemas/exploracion-oftalmologica';

export default function PatientExploracionOftalmologica({
    patient,
}: {
    patient: PatientExploracionOftalmologicaTab;
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
            <Head title={`Exploración Oftalmológica: ${patient.first_name}`} />

            <PatientRecordLayout
                patient={patient}
                currentTab="exploracion-oftalmologica"
            >
                <ExploracionOftalmologicaFormTab patient={patient} />
            </PatientRecordLayout>
        </AppLayout>
    );
}
