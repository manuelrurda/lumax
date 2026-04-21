import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export interface AppointmentFormData {
    id?: number;
    patientId: number;
    title: string;
    start: Date;
    end: Date;
    notes?: string;
}

interface AppointmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: Partial<AppointmentFormData> | null;
    onSave: (data: AppointmentFormData) => void;
    onDelete?: (id: number) => void;
}

// Temporary mocked patients
const mockPatients = [
    { id: 1, name: 'Juan Pérez' },
    { id: 2, name: 'María García' },
    { id: 3, name: 'Carlos López' },
];

export function AppointmentDialog({
    open,
    onOpenChange,
    initialData,
    onSave,
    onDelete,
}: AppointmentDialogProps) {
    const isEditing = !!initialData?.id;

    const [patientId, setPatientId] = useState<string>('');
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (open) {
            setPatientId(initialData?.patientId ? String(initialData.patientId) : '');
            setTitle(initialData?.title || '');
            setStart(
                initialData?.start
                    ? format(initialData.start, "yyyy-MM-dd'T'HH:mm")
                    : '',
            );
            setEnd(
                initialData?.end
                    ? format(initialData.end, "yyyy-MM-dd'T'HH:mm")
                    : '',
            );
            setNotes(initialData?.notes || '');
        }
    }, [open, initialData]);

    const handleSave = () => {
        if (!patientId || !title || !start || !end) return;

        onSave({
            id: initialData?.id,
            patientId: Number(patientId),
            title,
            start: new Date(start),
            end: new Date(end),
            notes,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar cita' : 'Nueva cita'}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="patient">Paciente</Label>
                        <Select
                            value={patientId}
                            onValueChange={(val) => {
                                setPatientId(val);
                                const patient = mockPatients.find((p) => String(p.id) === val);
                                if (patient && !title) {
                                    setTitle(`${patient.name} - Revisión`);
                                }
                            }}
                        >
                            <SelectTrigger id="patient">
                                <SelectValue placeholder="Seleccionar paciente" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockPatients.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej. Revisión anual"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="start">Inicio</Label>
                            <Input
                                id="start"
                                type="datetime-local"
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="end">Fin</Label>
                            <Input
                                id="end"
                                type="datetime-local"
                                value={end}
                                onChange={(e) => setEnd(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notas</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Notas opcionales..."
                        />
                    </div>
                </div>

                <DialogFooter className="flex justify-between sm:justify-between">
                    {isEditing && onDelete ? (
                        <Button
                            variant="destructive"
                            onClick={() => {
                                onDelete(initialData.id!);
                                onOpenChange(false);
                            }}
                        >
                            Eliminar
                        </Button>
                    ) : (
                        <div /> // Spacer
                    )}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleSave}>Guardar</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
