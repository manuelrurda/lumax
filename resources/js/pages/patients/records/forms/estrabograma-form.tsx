import ImageCanvas, {
    type CanvasShape,
} from '@/components/canvas/image-canvas';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDraftStore } from '@/hooks/use-draft-store';
import { router, usePage } from '@inertiajs/react';
import type { FormDataConvertible } from '@inertiajs/core';
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

    // Historical snapshot views render read-only (the layout also wraps
    // the form in a disabled fieldset, but Konva is not a form control,
    // so the canvas needs the flag explicitly — issue #5).
    const { isHistoryView } = usePage<{ isHistoryView?: boolean }>().props;
    const readOnly = Boolean(isHistoryView);

    const draftKey = `patient-${patient.id}-estrabograma`;
    const draftState = useDraftStore((state) => state.getDraft<EstrabogramaForm>(draftKey));
    const setDraft = useDraftStore((state) => state.setDraft);
    const clearDraft = useDraftStore((state) => state.clearDraft);

    const initialData = draftState || patient.estrabograma || {};

    const {
        register,
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

    // Canvas shapes live outside react-hook-form: ImageCanvas owns the
    // drawing (incl. undo/redo) and reports changes via onChange. They
    // are merged into the payload on save and into the draft on unmount,
    // exactly like the form fields.
    const initialShapes: CanvasShape[] = initialData.shapes ?? [];
    const [shapes, setShapes] = useState<CanvasShape[]>(initialShapes);
    const [savedShapes, setSavedShapes] =
        useState<CanvasShape[]>(initialShapes);
    const shapesDirty =
        JSON.stringify(shapes) !== JSON.stringify(savedShapes);
    const dirty = isDirty || shapesDirty;

    const dirtyRef = useRef(dirty);
    dirtyRef.current = dirty;
    const shapesRef = useRef(shapes);
    shapesRef.current = shapes;

    useEffect(() => {
        return () => {
            if (dirtyRef.current) {
                setDraft(draftKey, { ...getValues(), shapes: shapesRef.current });
            }
        };
    }, [draftKey, setDraft, getValues]);

    const onSubmit = (data: EstrabogramaForm) => {
        setIsSaving(true);
        router.put(
            `/patients/${patient.id}`,
            { ...patient, estrabograma: { ...data, shapes } } as unknown as Record<
                string,
                FormDataConvertible
            >,
            {
                onSuccess: () => {
                    setIsSaving(false);
                    clearDraft(draftKey);
                    setSavedShapes(shapes);
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
                <h2 className="text-xl font-semibold text-lumax-purple">Estrabograma</h2>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    className="bg-lumax-purple text-white hover:bg-lumax-purple-accent"
                    disabled={(!dirty && !draftState) || isSaving}
                >
                    {isSaving ? (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    Guardar cambios
                </Button>
            </div>

            {/* Annotation canvas over the estrabograma diagram. Drawings
                persist in the estrabograma JSON under `shapes` (#5). */}
            <div className="h-[600px] w-full overflow-hidden rounded-xl border">
                <ImageCanvas
                    backgroundImageUrl="/estrabograma2.svg"
                    className="h-full w-full"
                    initialShapes={initialShapes}
                    onChange={setShapes}
                    readOnly={readOnly}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Observaciones</label>
                <Textarea
                    {...register('observaciones')}
                    placeholder="Observaciones o notas clínicas..."
                    className="min-h-[80px]"
                />
            </div>
        </div>
    );
}
