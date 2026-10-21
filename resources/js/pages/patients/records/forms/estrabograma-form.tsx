import ImageCanvas from '@/components/canvas/image-canvas';
import { Button } from '@/components/ui/button';
import { useDraftStore } from '@/hooks/use-draft-store';
import { router } from '@inertiajs/react';
import { LoaderCircle, Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    defaultEstrabograma,
    EstrabogramaForm,
    PatientEstrabogramaTab,
} from '../schemas/estrabograma';

export function EstrabogramaFormTab({
    patient,
}: {
    patient: PatientEstrabogramaTab;
}) {
    const [isSaving, setIsSaving] = useState(false);

    const draftKey = `patient-${patient.id}-estrabograma`;
    const draftState = useDraftStore((state) => state.drafts[draftKey]);
    const setDraft = useDraftStore((state) => state.setDraft);
    const clearDraft = useDraftStore((state) => state.clearDraft);

    const initialData = draftState || patient.estrabograma || {};

    const {
        handleSubmit,
        reset,
        getValues,
        formState: { isDirty },
    } = useForm<EstrabogramaForm>({
        defaultValues: {
            ...defaultEstrabograma,
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

    const onSubmit = (data: EstrabogramaForm) => {
        setIsSaving(true);
        router.put(
            `/patients/${patient.id}`,
            {
                ...patient,
                estrabograma: data,
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
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-semibold">
                    Estrabograma (Canvas Test)
                </h2>
                <Button
                    onClick={handleSubmit(onSubmit)}
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

            {/* Test Image Canvas Component */}
            <div className="h-[600px] w-full overflow-hidden rounded-xl border">
                <ImageCanvas
                    backgroundImageUrl="/estrabograma2.svg"
                    className="h-full w-full"
                />
            </div>

            {/*
            ORIGINAL FORM COMMENTED OUT FOR TESTING:
            
            <div className="overflow-x-auto">
                <div
                    className="relative mx-auto"
                    style={{ width: 718, height: 435 }}
                >
                    <img
                        src="/estrabograma.svg"
                        alt="Estrabograma diagram"
                        className="pointer-events-none absolute inset-0 select-none"
                        style={{ width: 718, height: 435 }}
                        draggable={false}
                    />

                    <Input
                        {...register('campo_1')}
                        className={lineInput}
                        style={{ top: 40, left: 235, width: 70 }}
                    />
                    ...
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Observaciones</label>
                <Textarea
                    {...register('observaciones')}
                    placeholder="Observaciones o notas clínicas..."
                    className="min-h-[80px]"
                />
            </div>
            */}
        </div>
    );
}
