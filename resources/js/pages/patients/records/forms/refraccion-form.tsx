import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDraftStore } from '@/hooks/use-draft-store';
import { router } from '@inertiajs/react';
import { LoaderCircle, Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm, UseFormRegister } from 'react-hook-form';
import {
    defaultRefraccion,
    PatientRefraccionTab,
    RefraccionForm,
} from '../schemas/refraccion';

function MeasurementsGroup({
    title,
    prefix,
    register,
}: {
    title: string;
    prefix: 'od_sin' | 'od_con' | 'oi_sin' | 'oi_con';
    register: UseFormRegister<RefraccionForm>;
}) {
    // Reusable small borderless inputs like underscores
    const blankInput = 'w-16 h-7 px-1 text-center';

    return (
        <div className="mb-6 space-y-3">
            <h4 className="text-sm font-semibold">{title}</h4>

            <div className="flex items-center space-x-2 text-sm">
                <span className="w-28 font-medium">Queratometrias</span>
                <Input
                    className={blankInput}
                    {...register(`${prefix}_quera_1`)}
                />
                <span className="text-muted-foreground">=</span>
                <Input
                    className={blankInput}
                    {...register(`${prefix}_quera_2`)}
                />
                <span className="text-muted-foreground">x</span>
                <Input
                    className={blankInput}
                    {...register(`${prefix}_quera_3`)}
                />
            </div>

            <div className="flex items-center space-x-2 text-sm">
                <span className="w-28 font-medium">Retinoscopía</span>
                <Input
                    className={blankInput}
                    {...register(`${prefix}_retino_1`)}
                />
                <span className="text-muted-foreground">=</span>
                <Input
                    className={blankInput}
                    {...register(`${prefix}_retino_2`)}
                />
                <span className="text-muted-foreground">x</span>
                <Input
                    className={blankInput}
                    {...register(`${prefix}_retino_3`)}
                />
                <span className="text-muted-foreground">CV</span>
                <Input
                    className={blankInput}
                    {...register(`${prefix}_retino_4`)}
                />
            </div>

            <div className="flex items-center space-x-2 text-sm">
                <span className="w-28 font-medium">Refracción</span>
                <Input
                    className={blankInput}
                    {...register(`${prefix}_refrac_1`)}
                />
                <span className="text-muted-foreground">=</span>
                <Input
                    className={blankInput}
                    {...register(`${prefix}_refrac_2`)}
                />
                <span className="text-muted-foreground">x</span>
                <Input
                    className={blankInput}
                    {...register(`${prefix}_refrac_3`)}
                />
                <span className="text-muted-foreground">CV</span>
                <Input
                    className={blankInput}
                    {...register(`${prefix}_refrac_4`)}
                />
            </div>

            <div className="flex items-center space-x-2 text-sm">
                <span className="w-28 font-medium">Cicloplejia</span>
                <Input
                    className={blankInput}
                    {...register(`${prefix}_ciclo_1`)}
                />
                <span className="text-muted-foreground">=</span>
                <Input
                    className={blankInput}
                    {...register(`${prefix}_ciclo_2`)}
                />
                <span className="text-muted-foreground">x</span>
                <Input
                    className={blankInput}
                    {...register(`${prefix}_ciclo_3`)}
                />
                <span className="text-muted-foreground">CV</span>
                <Input
                    className={blankInput}
                    {...register(`${prefix}_ciclo_4`)}
                />
            </div>
        </div>
    );
}

export function RefraccionFormTab({
    patient,
}: {
    patient: PatientRefraccionTab;
}) {
    const [isSaving, setIsSaving] = useState(false);

    const draftKey = `patient-${patient.id}-refraccion`;
    const draftState = useDraftStore((state) => state.drafts[draftKey]);
    const setDraft = useDraftStore((state) => state.setDraft);
    const clearDraft = useDraftStore((state) => state.clearDraft);

    const initialData = draftState || patient.refraccion || {};

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { isDirty },
    } = useForm<RefraccionForm>({
        defaultValues: {
            ...defaultRefraccion,
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

    const onSubmit = (data: RefraccionForm) => {
        setIsSaving(true);
        router.put(
            `/patients/${patient.id}`,
            {
                ...patient,
                refraccion: data,
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

    const blankInput = 'w-24 px-1 text-center h-7';

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-xl border bg-card p-6 shadow-sm"
        >
            <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-semibold">Refracción</h2>
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

            <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2">
                {/* Separator line in the middle */}
                <div className="absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 bg-border/60 md:block" />

                {/* Left Column: Ojo Derecho */}
                <div className="space-y-6">
                    <h3 className="mb-6 border-b pb-2 text-center text-lg font-semibold tracking-tight text-lumax-purple">
                        Ojo derecho
                    </h3>

                    <MeasurementsGroup
                        title="Agudeza visual sin corrección"
                        prefix="od_sin"
                        register={register}
                    />

                    <MeasurementsGroup
                        title="Agudeza visual con corrección"
                        prefix="od_con"
                        register={register}
                    />

                    {/* Extras */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center space-x-2 text-sm">
                            <span className="w-40 font-medium">Adición</span>
                            <Input
                                className={blankInput}
                                {...register('od_adicion')}
                            />
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                            <span className="w-40 font-medium">
                                Distancia interpupilar
                            </span>
                            <Input
                                className={blankInput}
                                {...register('od_distancia')}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Ojo Izquierdo */}
                <div className="space-y-6">
                    <h3 className="mb-6 border-b pb-2 text-center text-lg font-semibold tracking-tight text-lumax-purple">
                        Ojo izquierdo
                    </h3>

                    <MeasurementsGroup
                        title="Agudeza visual sin corrección"
                        prefix="oi_sin"
                        register={register}
                    />

                    <MeasurementsGroup
                        title="Agudeza visual con corrección"
                        prefix="oi_con"
                        register={register}
                    />

                    {/* Extras */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center space-x-2 text-sm">
                            <span className="w-40 font-medium">Adición</span>
                            <Input
                                className={blankInput}
                                {...register('oi_adicion')}
                            />
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                            <span className="w-40 font-medium">
                                Distancia interpupilar
                            </span>
                            <Input
                                className={blankInput}
                                {...register('oi_distancia')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Comments */}
            <div className="border-t pt-6">
                <Label
                    htmlFor="comentarios"
                    className="mb-2 block text-base font-semibold"
                >
                    Comentarios
                </Label>
                <Textarea
                    id="comentarios"
                    className="min-h-[120px]"
                    {...register('comentarios')}
                />
            </div>
        </form>
    );
}
