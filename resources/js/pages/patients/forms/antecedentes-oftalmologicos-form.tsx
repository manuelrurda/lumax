import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { LoaderCircle, Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDraftStore } from '@/hooks/use-draft-store';
import {
    AntecedentesOftalmologicosForm,
    defaultAntecedentesOftalmologicos,
    PatientOftalmologicosTab,
} from '../schemas/antecedentes-oftalmologicos';

export function AntecedentesOftalmologicosFormTab({
    patient,
}: {
    patient: PatientOftalmologicosTab;
}) {
    const [isSaving, setIsSaving] = useState(false);

    const draftKey = `patient-${patient.id}-oftalmologicos`;
    const draftState = useDraftStore((state) => state.drafts[draftKey]);
    const setDraft = useDraftStore((state) => state.setDraft);
    const clearDraft = useDraftStore((state) => state.clearDraft);

    const initialData = draftState || patient.antecedentes_oftalmologicos || {};

    const {
        register,
        control,
        handleSubmit,
        reset,
        getValues,
        formState: { isDirty },
    } = useForm<AntecedentesOftalmologicosForm>({
        defaultValues: {
            ...defaultAntecedentesOftalmologicos,
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

    const onSubmit = (data: AntecedentesOftalmologicosForm) => {
        setIsSaving(true);
        console.log('Enviando datos...', data);

        router.put(
            `/patients/${patient.id}`,
            {
                ...patient,
                antecedentes_oftalmologicos: data,
            } as any,
            {
                onSuccess: () => {
                    setIsSaving(false);
                    clearDraft(draftKey);
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
                <h2 className="text-xl font-semibold">
                    Antecedentes Oftalmológicos
                </h2>
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

            <div className="grid grid-cols-1 gap-8 divide-border lg:grid-cols-2 lg:divide-x">
                {/* Lentes Aéreos */}
                <div className="space-y-6 lg:pr-4">
                    <h3 className="border-b pb-2 text-lg font-medium tracking-tight">
                        Lentes aéreos
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Última refracción</Label>
                            <Input
                                {...register(
                                    'lentes_aereos.ultima_refraccion',
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Gotas</Label>
                            <Input
                                {...register('lentes_aereos.gotas')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Cirugías previas</Label>
                            <Input
                                {...register(
                                    'lentes_aereos.cirugias_previas',
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Glaucoma</Label>
                            <Input
                                {...register('lentes_aereos.glaucoma')}
                            />
                        </div>
                    </div>
                </div>

                {/* Lentes de Contacto */}
                <div className="space-y-6 pt-6 lg:pt-0 lg:pl-10">
                    <div className="flex flex-col justify-between gap-4 border-b pb-2 sm:flex-row sm:items-center">
                        <h3 className="text-lg font-medium tracking-tight">
                            Lentes de contacto
                        </h3>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center space-x-2">
                                <Controller
                                    name="lentes_contacto.blandos"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            id="blandos"
                                            checked={field.value}
                                            onCheckedChange={
                                                field.onChange
                                            }
                                        />
                                    )}
                                />
                                <Label
                                    htmlFor="blandos"
                                    className="cursor-pointer"
                                >
                                    Blandos
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Controller
                                    name="lentes_contacto.rigidos"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            id="rigidos"
                                            checked={field.value}
                                            onCheckedChange={
                                                field.onChange
                                            }
                                        />
                                    )}
                                />
                                <Label
                                    htmlFor="rigidos"
                                    className="cursor-pointer"
                                >
                                    Rígidos
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Última refracción</Label>
                            <Input
                                {...register(
                                    'lentes_contacto.ultima_refraccion',
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Trauma ocular</Label>
                            <Input
                                {...register(
                                    'lentes_contacto.trauma_ocular',
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Láser</Label>
                            <Input
                                {...register('lentes_contacto.laser')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Otros</Label>
                            <Input
                                {...register('lentes_contacto.otros')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
