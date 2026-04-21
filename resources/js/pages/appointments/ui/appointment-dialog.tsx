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
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface AppointmentFormData {
    id?: number;
    patientId: number;
    patientName?: string;
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
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    const [patientSearch, setPatientSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (patientSearch.length < 2 || patientId !== '') {
                setSearchResults([]);
                return;
            }
            try {
                setIsSearching(true);
                const res = await fetch(
                    `/api/patients/search?q=${encodeURIComponent(patientSearch)}`,
                );
                const data = await res.json();
                setSearchResults(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [patientSearch, patientId]);

    useEffect(() => {
        if (open) {
            setPatientId(
                initialData?.patientId ? String(initialData.patientId) : '',
            );
            setPatientSearch(initialData?.patientName || '');
            setTitle(initialData?.title || '');
            
            setStartDate(initialData?.start ? format(initialData.start, 'yyyy-MM-dd') : '');
            setStartTime(initialData?.start ? format(initialData.start, 'HH:mm') : '');
            
            setEndDate(initialData?.end ? format(initialData.end, 'yyyy-MM-dd') : '');
            setEndTime(initialData?.end ? format(initialData.end, 'HH:mm') : '');

            setNotes(initialData?.notes || '');
            setError('');
        }
    }, [open, initialData]);

    useEffect(() => {
        if (startDate && startTime && endDate && endTime) {
            const startDt = new Date(`${startDate}T${startTime}`);
            const endDt = new Date(`${endDate}T${endTime}`);
            if (endDt <= startDt) {
                setError('La fecha y hora de fin debe ser posterior a la de inicio.');
            } else if (error === 'La fecha y hora de fin debe ser posterior a la de inicio.') {
                setError('');
            }
        }
    }, [startDate, startTime, endDate, endTime]);

    const handleSave = () => {
        setError('');
        if (!patientId || !title || !startDate || !startTime || !endDate || !endTime) {
            setError('Todos los campos obligatorios deben ser completados.');
            return;
        }

        const startDt = new Date(`${startDate}T${startTime}`);
        const endDt = new Date(`${endDate}T${endTime}`);

        if (endDt <= startDt) {
            setError('La fecha y hora de fin debe ser posterior a la de inicio.');
            return;
        }

        onSave({
            id: initialData?.id,
            patientId: Number(patientId),
            title,
            start: startDt,
            end: endDt,
            notes,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="sm:max-w-[500px]"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar cita' : 'Nueva cita'}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="relative grid gap-2">
                        <Label htmlFor="patient">
                            Paciente <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="patient"
                            placeholder="Buscar paciente..."
                            value={patientSearch}
                            onChange={(e) => {
                                setPatientSearch(e.target.value);
                                setPatientId('');
                                setShowDropdown(true);
                                setError('');
                            }}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() =>
                                setTimeout(() => setShowDropdown(false), 200)
                            }
                        />
                        {showDropdown &&
                            (patientSearch || searchResults.length > 0) && (
                                <div className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
                                    {isSearching ? (
                                        <div className="flex justify-center p-2">
                                            <Loader2 className="animate-spin" />
                                        </div>
                                    ) : searchResults.length === 0 ? (
                                        <div className="p-2 text-center text-sm text-muted-foreground">
                                            No se encontraron pacientes.
                                        </div>
                                    ) : (
                                        <ul className="py-1">
                                            {searchResults.map((p) => (
                                                <li
                                                    key={p.id}
                                                    className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                                    onClick={() => {
                                                        setPatientId(
                                                            String(p.id),
                                                        );
                                                        setPatientSearch(
                                                            `${p.first_name} ${p.last_name}`,
                                                        );
                                                        setShowDropdown(false);
                                                        if (!title) {
                                                            setTitle(
                                                                `${p.first_name} ${p.last_name} - Revisión`,
                                                            );
                                                        }
                                                        setError('');
                                                    }}
                                                >
                                                    {p.first_name} {p.last_name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="title">
                            Título <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setError('');
                            }}
                            placeholder="Ej. Revisión anual"
                        />
                    </div>

                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="startDate">
                                    Fecha Inicio <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        if (!endDate) setEndDate(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="startTime">
                                    Hora Inicio <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="endDate">
                                    Fecha Fin <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="endTime">
                                    Hora Fin <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="endTime"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
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

                    {error && (
                        <div className="text-sm font-medium text-destructive">
                            {error}
                        </div>
                    )}
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
                        <Button onClick={handleSave} disabled={!!error}>Guardar</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
