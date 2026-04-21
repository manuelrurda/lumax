import { format, getDay, parse, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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

interface MockEvent extends Event {
    id: number;
    patientId: number;
    notes?: string;
}

const mockEvents: MockEvent[] = [
    {
        id: 1,
        patientId: 1,
        title: 'Juan Pérez - Revisión',
        start: new Date(new Date().setHours(10, 0, 0, 0)),
        end: new Date(new Date().setHours(11, 0, 0, 0)),
        notes: 'Traer estudios anteriores',
    },
    {
        id: 2,
        patientId: 2,
        title: 'María García - Cirugía',
        start: new Date(new Date().setHours(14, 0, 0, 0)),
        end: new Date(new Date().setHours(16, 0, 0, 0)),
        notes: 'Ayuno de 8 horas',
    },
];

export function AppointmentsCalendar() {
    const [events, setEvents] = useState<MockEvent[]>(mockEvents);

    const onEventResize = (data: any) => {
        const { event, start, end } = data;
        const nextEvents = events.map((existingEvent) => {
            return existingEvent.id === event.id
                ? { ...existingEvent, start: new Date(start), end: new Date(end) }
                : existingEvent;
        });
        setEvents(nextEvents);
    };

    const onEventDrop = (data: any) => {
        const { event, start, end } = data;
        const nextEvents = events.map((existingEvent) => {
            return existingEvent.id === event.id
                ? { ...existingEvent, start: new Date(start), end: new Date(end) }
                : existingEvent;
        });
        setEvents(nextEvents);
    };

    const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
        const title = window.prompt('New Event name');
        if (title) {
            setEvents([
                ...events,
                {
                    start,
                    end,
                    title,
                    id: Math.random(),
                    patientId: 0,
                },
            ]);
        }
    };

    const handleSelectEvent = (e: any) => {
        const event = e as MockEvent;
        window.alert(`Event: ${event.title}\nNotes: ${event.notes}`);
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
        </div>
    );
}
