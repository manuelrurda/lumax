import { Button } from '@/components/ui/button';
import { useDraftStore } from '@/hooks/use-draft-store';
import { router } from '@inertiajs/react';
import type { FormDataConvertible } from '@inertiajs/core';
import { LoaderCircle, Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    AntecedentesForm,
    defaultAntecedentesHeredofamiliares,
    defaultAntecedentesNoPatologicos,
    defaultAntecedentesPatologicos,
    PatientAntecedentesTab,
    TipoSangre,
} from '../schemas/antecedentes';

import { AntecedentesHeredofamiliaresForm } from './antecedentes-heredofamiliares-form';
import { AntecedentesNoPatologicosForm } from './antecedentes-no-patologicos-form';
import { AntecedentesPatologicosForm } from './antecedentes-patologicos-form';

export function AntecedentesTab({
    patient,
}: {
    patient: PatientAntecedentesTab;
}) {
    const [isSaving, setIsSaving] = useState(false);

    const draftKey = `patient-${patient.id}-antecedentes`;
    const draftState = useDraftStore((state) => state.getDraft<AntecedentesForm>(draftKey));
    const setDraft = useDraftStore((state) => state.setDraft);
    const clearDraft = useDraftStore((state) => state.clearDraft);

    const initialData = (draftState ||
        patient.antecedentes ||
        {}) as AntecedentesForm;

    const {
        register,
        control,
        handleSubmit,
        watch,
        reset,
        getValues,
        formState: { isDirty },
    } = useForm<AntecedentesForm>({
        defaultValues: {
            antecedentes_no_patologicos: {
                ...defaultAntecedentesNoPatologicos,
                ...(initialData.antecedentes_no_patologicos || {}),
                tipo_sangre:
                    (initialData.antecedentes_no_patologicos
                        ?.tipo_sangre as TipoSangre) || '',
            },
            antecedentes_patologicos: {
                ...defaultAntecedentesPatologicos,
                ...(initialData.antecedentes_patologicos || {}),
            },
            antecedentes_heredofamiliares: {
                ...defaultAntecedentesHeredofamiliares,
                ...(initialData.antecedentes_heredofamiliares || {}),
            },
        } as AntecedentesForm,
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

    const onSubmit = (data: AntecedentesForm) => {
        setIsSaving(true);
        console.log('Enviando datos...', data);

        router.put(
            `/patients/${patient.id}`,
            { ...patient, antecedentes: data } as unknown as Record<
                string,
                FormDataConvertible
            >,
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
                <h2 className="text-xl font-semibold text-lumax-purple">Antecedentes</h2>
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

            <AntecedentesNoPatologicosForm
                register={register}
                control={control}
                watch={watch}
            />
            <AntecedentesPatologicosForm
                register={register}
                control={control}
                watch={watch}
            />
            <AntecedentesHeredofamiliaresForm
                register={register}
                control={control}
                watch={watch}
            />
        </form>
    );
}
