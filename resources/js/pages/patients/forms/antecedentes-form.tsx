import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { LoaderCircle, Save } from 'lucide-react';
import { useState } from 'react';
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

    const {
        register,
        control,
        handleSubmit,
        watch,
        reset,
        formState: { isDirty },
    } = useForm<AntecedentesForm>({
        defaultValues: {
            antecedentes_no_patologicos: {
                ...defaultAntecedentesNoPatologicos,
                ...(patient.antecedentes?.antecedentes_no_patologicos || {}),
                tipo_sangre:
                    (patient.antecedentes?.antecedentes_no_patologicos
                        ?.tipo_sangre as TipoSangre) || '',
            },
            antecedentes_patologicos: {
                ...defaultAntecedentesPatologicos,
                ...(patient.antecedentes?.antecedentes_patologicos || {}),
            },
            antecedentes_heredofamiliares: {
                ...defaultAntecedentesHeredofamiliares,
                ...(patient.antecedentes?.antecedentes_heredofamiliares || {}),
            },
        } as AntecedentesForm,
    });

    const onSubmit = (data: AntecedentesForm) => {
        setIsSaving(true);
        console.log('Enviando datos...', data);

        router.put(
            `/patients/${patient.id}`,
            {
                ...patient,
                antecedentes: data,
            } as any,
            {
                onSuccess: () => {
                    setIsSaving(false);
                    reset({}, { keepValues: true }); // Reset isDirty state
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
                <h2 className="text-xl font-semibold">Antecedentes</h2>
                <Button
                    type="submit"
                    className="bg-lumax-purple text-white hover:bg-lumax-purple-accent"
                    disabled={!isDirty || isSaving}
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
