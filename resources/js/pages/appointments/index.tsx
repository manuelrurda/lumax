import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AppointmentsCalendar } from './ui/appointments-calendar';

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
            <div className="flex h-screen flex-1 flex-col p-6">
                <div className="flex-1 overflow-hidden">
                    <AppointmentsCalendar />
                </div>
            </div>
        </AppLayout>
    );
}
