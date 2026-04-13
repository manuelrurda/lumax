import { Patient } from '@/types';
import { Link } from '@inertiajs/react';
import React from 'react';
import { EditPatientDialog } from './edit-patient-dialog';

interface PatientRecordLayoutProps {
    patient: Patient;
    currentTab: string;
    children: React.ReactNode;
}

export function PatientRecordLayout({ patient, currentTab, children }: PatientRecordLayoutProps) {
    const tabs = [
        { id: 'info', label: 'Antecedentes no patológicos', href: `/patients/${patient.id}` },
        { id: 'medical-history', label: 'Historial Médico', href: `#` },
        { id: 'consultations', label: 'Consultas', href: `#` },
        { id: 'prescriptions', label: 'Recetas', href: `#` },
        { id: 'files', label: 'Archivos', href: `#` },
    ];

    return (
        <div className="flex h-full flex-1 flex-col">
            <div className="px-6 py-6 pb-0">
                <div className="flex items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            {patient.first_name} {patient.last_name}
                            <EditPatientDialog patient={patient} />
                        </h1>
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Teléfono: {patient.phone || 'No registrado'}</span>
                            <span>|</span>
                            <span>Correo: {patient.email || 'No registrado'}</span>
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

            <div className="flex-1 p-6">
                {children}
            </div>
        </div>
    );
}
