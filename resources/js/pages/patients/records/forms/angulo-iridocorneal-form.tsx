import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
    AnguloIridocornealForm,
    defaultAnguloIridocorneal,
    PatientAnguloIridocornealTab,
} from '../schemas/angulo-iridocorneal';

export function AnguloIridocornealFormTab({
    patient,
}: {
    patient: PatientAnguloIridocornealTab;
}) {
    const {
        handleSubmit,
        formState: { isDirty },
    } = useForm<AnguloIridocornealForm>({
        defaultValues: {
            ...defaultAnguloIridocorneal,
            ...(patient.angulo_iridocorneal || {}),
        },
    });

    const onSubmit = (data: AnguloIridocornealForm) => {
        console.log('Ángulo Iridocorneal submit (UI only):', data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-xl border bg-card p-6 shadow-sm"
        >
            <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-semibold">
                    Ángulo Iridocorneal
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
