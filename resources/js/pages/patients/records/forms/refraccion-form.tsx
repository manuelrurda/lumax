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

function AgudezaVisualRow({
    label,
    namePrefix,
    register,
}: {
    label: string;
    namePrefix: 'od_av_sin' | 'od_av_con' | 'oi_av_sin' | 'oi_av_con';
    register: UseFormRegister<RefraccionForm>;
}) {
    return (
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="font-medium text-muted-foreground sm:w-48">
                {label}
            </span>
            <div className="flex items-center gap-1.5">
                <select
                    className="h-7 w-20 rounded-md border border-input bg-background px-2 py-0 text-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                    defaultValue=""
                    {...register(`${namePrefix}_opt1`)}
                >
                    <option value=""></option>
                    <option value="20">20</option>
                </select>
                <span className="font-semibold text-muted-foreground">/</span>
                <select
                    className="h-7 w-20 rounded-md border border-input bg-background px-2 py-0 text-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                    defaultValue=""
                    {...register(`${namePrefix}_opt2`)}
                >
                    <option value=""></option>
                    <option value="20">20</option>
                    <option value="25">25</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                    <option value="70">70</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                </select>
                <Input
                    className="h-7 w-20 px-2 py-0 text-center"
                    placeholder="Otros"
                    {...register(`${namePrefix}_input`)}
                />
            </div>
        </div>
    );
}

function MeasurementsGroup({
    prefix,
    register,
}: {
    prefix: 'od' | 'oi';
    register: UseFormRegister<RefraccionForm>;
}) {
    // Reusable small borderless inputs like underscores
    const blankInput = 'w-16 h-7 px-1 text-center';

    return (
        <div className="mb-6 space-y-3 border-t pt-4">
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

                    <div className="space-y-4">
                        <AgudezaVisualRow
                            label="Agudeza visual sin corrección"
                            namePrefix="od_av_sin"
                            register={register}
                        />
                        <AgudezaVisualRow
                            label="Agudeza visual con corrección"
                            namePrefix="od_av_con"
                            register={register}
                        />
                    </div>

                    <MeasurementsGroup prefix="od" register={register} />

                    {/* Extras */}
                    <div className="space-y-4 border-t pt-4">
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

                    <div className="space-y-4">
                        <AgudezaVisualRow
                            label="Agudeza visual sin corrección"
                            namePrefix="oi_av_sin"
                            register={register}
                        />
                        <AgudezaVisualRow
                            label="Agudeza visual con corrección"
                            namePrefix="oi_av_con"
                            register={register}
                        />
                    </div>

                    <MeasurementsGroup prefix="oi" register={register} />

                    {/* Extras */}
                    <div className="space-y-4 border-t pt-4">
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
