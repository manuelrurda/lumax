import { Patient } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { Clock } from 'lucide-react';
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
        { id: 'info', label: 'Antecedentes', href: `/patients/${patient.id}/antecedentes` },
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
            id: 'refraccion',
            label: 'Refracción',
            href: `/patients/${patient.id}/refraccion`,
        },
        {
            id: 'estrabograma',
            label: 'Estrabograma',
            href: `/patients/${patient.id}/estrabograma`,
        },
        {
            id: 'angulo-iridocorneal',
            label: 'Ángulo Iridocorneal',
            href: `/patients/${patient.id}/angulo-iridocorneal`,
        },
    ];

    const { isHistoryView, activityId, historyDate } = usePage<{
        isHistoryView?: boolean;
        activityId?: number;
        historyDate?: string;
    }>().props;

    const getHref = (basePath: string) => {
        return activityId ? `${basePath}?activity_id=${activityId}` : basePath;
    };

    return (
        <div className="flex h-full flex-1 flex-col">
            <div className="px-6 py-6 pb-0">
                <div className="flex items-start gap-4">
                    <div>
                        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-foreground">
                            {patient.first_name} {patient.last_name}
                            {!isHistoryView && <EditPatientDialog patient={patient} />}
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

                {isHistoryView && historyDate && (
                    <div className="mt-4 flex items-center gap-2 rounded-md bg-amber-500/10 p-3 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                        <Clock className="h-5 w-5" />
                        <span className="text-sm font-medium">
                            Estás viendo un registro histórico guardado el{' '}
                            {new Date(historyDate).toLocaleDateString('es-MX', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                            . El expediente está en modo solo lectura.
                        </span>
                    </div>
                )}

                <div className="mt-8 flex gap-8 border-b">
                    {tabs.map((tab) => {
                        const isActive = currentTab === tab.id;
                        return (
                            <Link
                                key={tab.id}
                                href={getHref(tab.href)}
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
                <fieldset disabled={isHistoryView} className="h-full">
                    {children}
                </fieldset>
            </div>
        </div>
    );
}
