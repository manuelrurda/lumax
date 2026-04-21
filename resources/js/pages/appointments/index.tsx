import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CalendarDays } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Citas',
        href: '/appointments',
    },
];

export default function AppointmentsPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Citas" />

            <div className="flex h-full flex-1 flex-col p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Citas</h1>
                    <p className="text-sm text-muted-foreground">
                        Gestión de citas de pacientes
                    </p>
                </div>

                {/* Placeholder — calendar will be built in next steps */}
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border bg-card">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <CalendarDays className="h-12 w-12 opacity-30" />
                        <p className="text-sm">El calendario de citas aparecerá aquí</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
