import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Patient } from '@/types';
import { router } from '@inertiajs/react';
import { Archive, Edit } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
    first_name: string;
    last_name: string;
    phone: string | null;
    email: string | null;
};

export function EditPatientDialog({ patient }: { patient: Patient }) {
    const [open, setOpen] = useState(false);
    const [archiveOpen, setArchiveOpen] = useState(false);
    const futureAppointments = patient.future_appointments_count ?? 0;

    const handleArchive = () => {
        router.delete(`/patients/${patient.id}`, {
            onSuccess: () => {
                setArchiveOpen(false);
                setOpen(false);
            },
        });
    };
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            first_name: patient.first_name,
            last_name: patient.last_name,
            phone: patient.phone,
            email: patient.email,
        },
    });

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            reset({
                first_name: patient.first_name,
                last_name: patient.last_name,
                phone: patient.phone,
                email: patient.email,
            });
        }
    };

    const onSubmit = (data: FormData) => {
        router.put(`/patients/${patient.id}`, data, {
            onError: (serverErrors) => {
                for (const field in serverErrors) {
                    setError(field as keyof FormData, {
                        type: 'server',
                        message: serverErrors[field],
                    });
                }
            },
            onSuccess: () => {
                handleOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar paciente</DialogTitle>
                    <DialogDescription>
                        Edite los datos del paciente y guarde los cambios.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor={`first_name_${patient.id}`}>Nombre(s) <span className="text-red-500">*</span></Label>
                            <Input
                                id={`first_name_${patient.id}`}
                                placeholder="Javier"
                                {...register('first_name', { required: 'Este campo es requerido' })}
                            />
                            {errors.first_name && (
                                <span className="text-sm text-red-500">{errors.first_name.message}</span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor={`last_name_${patient.id}`}>Apellidos <span className="text-red-500">*</span></Label>
                            <Input
                                id={`last_name_${patient.id}`}
                                placeholder="Pérez"
                                {...register('last_name', { required: 'Este campo es requerido' })}
                            />
                            {errors.last_name && (
                                <span className="text-sm text-red-500">{errors.last_name.message}</span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor={`phone_${patient.id}`}>Número de teléfono</Label>
                            <Input
                                id={`phone_${patient.id}`}
                                type="tel"
                                placeholder="5512345678"
                                {...register('phone', {
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: 'Solo se permiten números',
                                    },
                                })}
                            />
                            {errors.phone && (
                                <span className="text-sm text-red-500">{errors.phone.message}</span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor={`email_${patient.id}`}>Correo electrónico</Label>
                            <Input
                                id={`email_${patient.id}`}
                                type="email"
                                placeholder="javier@ejemplo.com"
                                {...register('email')}
                            />
                            {errors.email && (
                                <span className="text-sm text-red-500">{errors.email.message}</span>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-lumax-purple hover:bg-lumax-purple-accent text-white">
                            Guardar cambios
                        </Button>
                    </DialogFooter>
                </form>

                <div className="space-y-3 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                    <div className="space-y-0.5 text-red-600 dark:text-red-100">
                        <p className="font-medium">Archivar paciente</p>
                        <p className="text-sm">
                            El paciente dejará de aparecer en la lista y en las
                            búsquedas. Su expediente e historial se conservan.
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setArchiveOpen(true)}
                    >
                        <Archive className="h-4 w-4" />
                        Archivar paciente
                    </Button>
                </div>
            </DialogContent>

            <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            ¿Archivar a {patient.first_name} {patient.last_name}?
                        </DialogTitle>
                        <DialogDescription>
                            El paciente dejará de aparecer en la lista y en las
                            búsquedas. Su expediente e historial se conservan y
                            podrás restaurarlo. Sus citas futuras se eliminarán.
                        </DialogDescription>
                    </DialogHeader>
                    {futureAppointments > 0 && (
                        <p className="text-sm font-medium text-destructive">
                            Tiene {futureAppointments}{' '}
                            {futureAppointments === 1
                                ? 'cita futura que se eliminará'
                                : 'citas futuras que se eliminarán'}
                            .
                        </p>
                    )}
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setArchiveOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleArchive}
                        >
                            Sí, archivar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Dialog>
    );
}
