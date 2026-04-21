import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
    defaultExploracionOftalmologica,
    ExploracionOftalmologicaForm,
    PatientExploracionOftalmologicaTab,
} from '../schemas/exploracion-oftalmologica';

export function ExploracionOftalmologicaFormTab({
    patient,
}: {
    patient: PatientExploracionOftalmologicaTab;
}) {
    const {
        register,
        handleSubmit,
        formState: { isDirty },
    } = useForm<ExploracionOftalmologicaForm>({
        defaultValues: {
            ...defaultExploracionOftalmologica,
            ...(patient.exploracion_oftalmologica || {}),
        },
    });

    const onSubmit = (data: ExploracionOftalmologicaForm) => {
        console.log('Exploración Oftalmológica submit (UI only):', data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-xl border bg-card p-6 shadow-sm"
        >
            <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-semibold">
                    Exploración Oftalmológica
                </h2>
                <Button
                    type="submit"
                    className="bg-lumax-purple text-white hover:bg-lumax-purple-accent"
                    disabled={!isDirty}
                >
                    <Save className="mr-2 h-4 w-4" />
                    Guardar cambios
                </Button>
            </div>

            {/* Form fields go here */}
        </form>
    );
}
