import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDraftStore } from '@/hooks/use-draft-store';
import { router } from '@inertiajs/react';
import { LoaderCircle, Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
    const [isSaving, setIsSaving] = useState(false);

    const draftKey = `patient-${patient.id}-exploracion-fisica`;
    const draftState = useDraftStore((state) => state.drafts[draftKey]);
    const setDraft = useDraftStore((state) => state.setDraft);
    const clearDraft = useDraftStore((state) => state.clearDraft);

    const initialData = draftState || patient.exploracion_fisica || {};

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { isDirty },
    } = useForm<ExploracionFisicaForm>({
        defaultValues: {
            ...defaultExploracionFisica,
            ...(initialData || {}),
        },
    });

    const isDirtyRef = useRef(isDirty);
    isDirtyRef.current = isDirty;

    useEffect(() => {
        return () => {
            if (isDirtyRef.current) {
                setDraft(draftKey, getValues());
            }
        };
    }, [draftKey, setDraft, getValues]);

    const onSubmit = (data: ExploracionFisicaForm) => {
        setIsSaving(true);
        router.put(
            `/patients/${patient.id}`,
            {
                ...patient,
                exploracion_fisica: data,
            } as any,
            {
                onSuccess: () => {
                    setIsSaving(false);
                    clearDraft(draftKey);
                    // Update default values to new ones, thus clearing isDirty
                    reset({}, { keepValues: true });
                },
                onError: () => setIsSaving(false),
                preserveScroll: true,
            },
        );
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
                    disabled={(!isDirty && !draftState) || isSaving}
                >
                    {isSaving ? (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    Guardar cambios
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                    <Label htmlFor="frecuencia_cardiaca">
                        Frecuencia cardíaca
                    </Label>
                    <Input
                        id="frecuencia_cardiaca"
                        {...register('frecuencia_cardiaca')}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="frecuencia_respiratoria">
                        Frecuencia respiratoria
                    </Label>
                    <Input
                        id="frecuencia_respiratoria"
                        {...register('frecuencia_respiratoria')}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="presion_arterial">Presión arterial</Label>
                    <Input
                        id="presion_arterial"
                        {...register('presion_arterial')}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="temperatura">Temperatura</Label>
                    <Input id="temperatura" {...register('temperatura')} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="padecimiento_actual">
                    Padecimiento actual / Notas clínicas
                </Label>
                <Textarea
                    id="padecimiento_actual"
                    className="min-h-[150px]"
                    {...register('padecimiento_actual')}
                />
            </div>
        </form>
    );
}
