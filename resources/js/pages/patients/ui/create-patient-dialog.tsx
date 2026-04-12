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
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
};

export function CreatePatientDialog() {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<FormData>();

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            reset();
        }
    };

    const onSubmit = (data: FormData) => {
        router.post('/patients', data, {
            onError: (serverErrors) => {
                for (const field in serverErrors) {
                    setError(field as keyof FormData, {
                        type: 'server',
                        message: serverErrors[field],
                    });
                }
            },
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-lumax-purple text-white hover:bg-lumax-purple-accent">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Agregar nuevo paciente</DialogTitle>
                    <DialogDescription>
                        Ingrese los datos requeridos para crear un nuevo registro de paciente.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first_name">Nombre(s) <span className="text-red-500">*</span></Label>
                            <Input
                                id="first_name"
                                placeholder="Javier"
                                {...register('first_name', { required: 'Este campo es requerido' })}
                            />
                            {errors.first_name && (
                                <span className="text-sm text-red-500">{errors.first_name.message}</span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last_name">Apellidos <span className="text-red-500">*</span></Label>
                            <Input
                                id="last_name"
                                placeholder="Pérez"
                                {...register('last_name', { required: 'Este campo es requerido' })}
                            />
                            {errors.last_name && (
                                <span className="text-sm text-red-500">{errors.last_name.message}</span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Número de teléfono</Label>
                            <Input
                                id="phone"
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
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
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
                            Guardar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
