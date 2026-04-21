import { Patient } from '@/types';
import { Link } from '@inertiajs/react';
import React from 'react';
import { EditPatientDialog } from '../ui/edit-patient-dialog';

interface PatientRecordLayoutProps {
    patient: Patient;
    currentTab: string;
    children: React.ReactNode;
}

export function PatientRecordLayout({
    patient,
    currentTab,
    children,
}: PatientRecordLayoutProps) {
    const tabs = [
        { id: 'info', label: 'Antecedentes', href: `/patients/${patient.id}` },
        {
            id: 'oftalmologicos',
            label: 'Antecedentes Oftalmológicos',
            href: `/patients/${patient.id}/oftalmologicos`,
        },
        {
            id: 'exploracion-fisica',
            label: 'Exploración Física',
            href: `/patients/${patient.id}/exploracion-fisica`,
        },
        {
            id: 'exploracion-oftalmologica',
            label: 'Exploración Oftalmológica',
            href: `/patients/${patient.id}/exploracion-oftalmologica`,
        },
        {
            id: 'estrabograma',
            label: 'Estrabograma',
            href: `/patients/${patient.id}/estrabograma`,
        },
        { id: 'files', label: 'Archivos', href: `#` },
    ];

    return (
        <div className="flex h-full flex-1 flex-col">
            <div className="px-6 py-6 pb-0">
                <div className="flex items-start gap-4">
                    <div>
                        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-foreground">
                            {patient.first_name} {patient.last_name}
                            <EditPatientDialog patient={patient} />
                        </h1>
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                                Teléfono: {patient.phone || 'No registrado'}
                            </span>
                            <span>|</span>
                            <span>
                                Correo: {patient.email || 'No registrado'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex gap-8 border-b">
                    {tabs.map((tab) => {
                        const isActive = currentTab === tab.id;
                        return (
                            <Link
                                key={tab.id}
                                href={tab.href}
                                className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
                                    isActive
                                        ? 'border-lumax-purple text-foreground'
                                        : 'border-transparent text-muted-foreground hover:border-muted hover:text-foreground'
                                }`}
                            >
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 p-6">{children}</div>
        </div>
    );
}
