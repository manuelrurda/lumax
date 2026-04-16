import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
    defaultExploracionFisica,
    ExploracionFisicaForm,
    PatientExploracionFisicaTab,
} from '../schemas/exploracion-fisica';

export function ExploracionFisicaFormTab({
    patient,
}: {
    patient: PatientExploracionFisicaTab;
}) {
    const {
        register,
        handleSubmit,
        formState: { isDirty },
    } = useForm<ExploracionFisicaForm>({
        defaultValues: {
            ...defaultExploracionFisica,
            ...(patient.exploracion_fisica || {}),
        },
    });

    const onSubmit = (data: ExploracionFisicaForm) => {
        console.log('Form UI Only Submit:', data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-xl border bg-card p-6 shadow-sm"
        >
            <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-semibold">Exploración Física</h2>
                <Button
                    type="submit"
                    className="bg-lumax-purple text-white hover:bg-lumax-purple-accent"
                    disabled={!isDirty}
                >
                    <Save className="mr-2 h-4 w-4" />
                    Guardar cambios
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                    <Label htmlFor="frecuencia_cardiaca">Frecuencia cardíaca</Label>
                    <Input id="frecuencia_cardiaca" {...register('frecuencia_cardiaca')} />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="frecuencia_respiratoria">Frecuencia respiratoria</Label>
                    <Input id="frecuencia_respiratoria" {...register('frecuencia_respiratoria')} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="presion_arterial">Presión arterial</Label>
                    <Input id="presion_arterial" {...register('presion_arterial')} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="temperatura">Temperatura</Label>
                    <Input id="temperatura" {...register('temperatura')} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="padecimiento_actual">Padecimiento actual / Notas clínicas</Label>
                <Textarea 
                    id="padecimiento_actual" 
                    className="min-h-[150px]"
                    {...register('padecimiento_actual')} 
                />
            </div>
        </form>
    );
}
