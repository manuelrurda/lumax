import { router } from '@inertiajs/react';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { AppointmentDialog, type AppointmentFormData } from './appointment-dialog';

const locales = {
    'es': es,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

interface BackendEvent extends Event {
    id: number;
    patientId: number;
    notes?: string;
}

export function AppointmentsCalendar() {
    const [events, setEvents] = useState<BackendEvent[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState<Partial<AppointmentFormData> | null>(null);

    const fetchEvents = async (range?: Date[] | { start: Date; end: Date }) => {
        try {
            // Can pass ?start=...&end=... if we map range
            const res = await fetch('/appointments', {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            const data = await res.json();
            setEvents(
                data.map((e: any) => ({
                    id: e.id,
                    patientId: e.patient_id,
                    title: e.title,
                    notes: e.notes,
                    start: new Date(e.starts_at),
                    end: new Date(e.ends_at),
                })),
            );
        } catch (error) {
            console.error('Failed to fetch events', error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const onEventResize = (data: any) => {
        const { event, start, end } = data;
        router.put(
            `/appointments/${event.id}`,
            {
                starts_at: start.toISOString(),
                ends_at: end.toISOString()
            },
            { onSuccess: () => fetchEvents() }
        );
    };

    const onEventDrop = (data: any) => {
        const { event, start, end } = data;
        router.put(
            `/appointments/${event.id}`,
            {
                starts_at: start.toISOString(),
                ends_at: end.toISOString()
            },
            { onSuccess: () => fetchEvents() }
        );
    };

    const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
        setDialogData({ start, end, title: '', notes: '' });
        setDialogOpen(true);
    };

    const handleSelectEvent = (e: any) => {
        const event = e as BackendEvent;
        setDialogData({
            id: event.id,
            patientId: event.patientId,
            title: event.title as string,
            start: event.start as Date,
            end: event.end as Date,
            notes: event.notes,
        });
        setDialogOpen(true);
    };

    const handleSaveEvent = (data: AppointmentFormData) => {
        const payload = {
            patient_id: data.patientId,
            title: data.title,
            notes: data.notes,
            starts_at: data.start.toISOString(),
            ends_at: data.end.toISOString(),
        };

        if (data.id) {
            router.put(`/appointments/${data.id}`, payload, {
                onSuccess: () => {
                    setDialogOpen(false);
                    fetchEvents();
                },
            });
        } else {
            router.post('/appointments', payload, {
                onSuccess: () => {
                    setDialogOpen(false);
                    fetchEvents();
                },
            });
        }
    };

    const handleDeleteEvent = (id: number) => {
        router.delete(`/appointments/${id}`, {
            onSuccess: () => {
                setDialogOpen(false);
                fetchEvents();
            },
        });
    };

    return (
        <div className="h-full w-full">
            <DnDCalendar
                localizer={localizer}
                culture="es"
                messages={{
                    week: 'Semana',
                    work_week: 'Semana laboral',
                    day: 'Día',
                    month: 'Mes',
                    previous: 'Anterior',
                    next: 'Siguiente',
                    today: 'Hoy',
                    agenda: 'Agenda',
                    noEventsInRange: 'No hay citas en este rango.',
                    showMore: (total) => `+${total} más`,
                }}
                events={events}
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable
                resizable
                defaultView="week"
                views={['week', 'day']}
                step={30}
                timeslots={2}
                min={new Date(0, 0, 0, 6, 0, 0)} // Start at 6 AM
                max={new Date(0, 0, 0, 22, 0, 0)} // End at 10 PM
            />

            <AppointmentDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                initialData={dialogData}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
            />
        </div>
    );
}
