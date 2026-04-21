import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
    defaultEstrabograma,
    EstrabogramaForm,
    PatientEstrabogramaTab,
} from '../schemas/estrabograma';

// Shared style for all diagram input lines
const lineInput =
    'absolute border-1 border-foreground bg-white text-center' +
    'focus:border-foreground focus:ring-0 px-1 leading-none text-sm';

export function EstrabogramaFormTab({
    patient,
}: {
    patient: PatientEstrabogramaTab;
}) {
    const {
        register,
        handleSubmit,
        formState: { isDirty },
    } = useForm<EstrabogramaForm>({
        defaultValues: {
            ...defaultEstrabograma,
            ...(patient.estrabograma || {}),
        },
    });

    const onSubmit = (data: EstrabogramaForm) => {
        console.log('Estrabograma submit (UI only):', data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 rounded-xl border bg-card p-6 shadow-sm"
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-semibold">Estrabograma</h2>
                <Button
                    type="submit"
                    className="bg-lumax-purple text-white hover:bg-lumax-purple-accent"
                    disabled={!isDirty}
                >
                    <Save className="mr-2 h-4 w-4" />
                    Guardar cambios
                </Button>
            </div>

            {/* Diagram — 718×535 coordinate space matching the SVG */}
            <div className="overflow-x-auto">
                <div
                    className="relative mx-auto"
                    style={{ width: 718, height: 435 }}
                >
                    {/* Background SVG image */}
                    <img
                        src="/estrabograma.svg"
                        alt="Estrabograma diagram"
                        className="pointer-events-none absolute inset-0 select-none"
                        style={{ width: 718, height: 435 }}
                        draggable={false}
                    />

                    {/* ── Inputs overlaid on SVG coordinate space ── */}
                    {/* Top-left box */}
                    <input
                        {...register('campo_1')}
                        className={lineInput}
                        style={{ top: 40, left: 235, width: 70 }}
                    />
                    <input
                        {...register('campo_2')}
                        className={lineInput}
                        style={{ top: 130, left: 35, width: 70 }}
                    />

                    {/* Top-right box */}
                    <input
                        {...register('campo_3')}
                        className={lineInput}
                        style={{ top: 40, left: 411, width: 70 }}
                    />
                    <input
                        {...register('campo_4')}
                        className={lineInput}
                        style={{ top: 130, left: 613, width: 70 }}
                    />

                    {/* Three inputs on top of left triangle */}
                    <input
                        {...register('campo_5')}
                        className={lineInput}
                        style={{ top: 170, left: 160, width: 52 }}
                    />
                    <input
                        {...register('campo_6')}
                        className={lineInput}
                        style={{ top: 170, left: 220, width: 52 }}
                    />
                    <input
                        {...register('campo_7')}
                        className={lineInput}
                        style={{ top: 170, left: 280, width: 52 }}
                    />

                    {/* Three inputs on top of right triangle */}
                    <input
                        {...register('campo_8')}
                        className={lineInput}
                        style={{ top: 170, left: 385, width: 52 }}
                    />
                    <input
                        {...register('campo_9')}
                        className={lineInput}
                        style={{ top: 170, left: 445, width: 52 }}
                    />
                    <input
                        {...register('campo_10')}
                        className={lineInput}
                        style={{ top: 170, left: 505, width: 52 }}
                    />

                    {/* Three inputs on the middle of left triangle */}
                    <input
                        {...register('campo_11')}
                        className={lineInput}
                        style={{ top: 290, left: 90, width: 52 }}
                    />
                    <input
                        {...register('campo_12')}
                        className={lineInput}
                        style={{ top: 290, left: 190, width: 52 }}
                    />
                    <input
                        {...register('campo_13')}
                        className={lineInput}
                        style={{ top: 290, left: 280, width: 52 }}
                    />

                    {/* Three inputs on the middle of right triangle */}
                    <input
                        {...register('campo_14')}
                        className={lineInput}
                        style={{ top: 290, left: 385, width: 52 }}
                    />
                    <input
                        {...register('campo_15')}
                        className={lineInput}
                        style={{ top: 290, left: 475, width: 52 }}
                    />
                    <input
                        {...register('campo_16')}
                        className={lineInput}
                        style={{ top: 290, left: 575, width: 52 }}
                    />

                    {/* Three inputs on the bottom of left triangle */}
                    <input
                        {...register('campo_17')}
                        className={lineInput}
                        style={{ top: 400, left: 160, width: 52 }}
                    />
                    <input
                        {...register('campo_18')}
                        className={lineInput}
                        style={{ top: 400, left: 220, width: 52 }}
                    />
                    <input
                        {...register('campo_19')}
                        className={lineInput}
                        style={{ top: 400, left: 280, width: 52 }}
                    />

                    {/* Three inputs on the bottom of right triangle */}
                    <input
                        {...register('campo_20')}
                        className={lineInput}
                        style={{ top: 400, left: 385, width: 52 }}
                    />
                    <input
                        {...register('campo_21')}
                        className={lineInput}
                        style={{ top: 400, left: 445, width: 52 }}
                    />
                    <input
                        {...register('campo_22')}
                        className={lineInput}
                        style={{ top: 400, left: 505, width: 52 }}
                    />

                    {/* Two wide inputs between triangles */}
                    <input
                        {...register('campo_23')}
                        className={lineInput}
                        style={{ top: 240, left: 285, width: 150 }}
                    />
                    <input
                        {...register('campo_24')}
                        className={lineInput}
                        style={{ top: 340, left: 285, width: 150 }}
                    />

                    {/* Two wide inputs outside the triangles */}
                    <input
                        {...register('campo_25')}
                        className={lineInput}
                        style={{ top: 340, width: 150 }}
                    />
                    <input
                        {...register('campo_26')}
                        className={lineInput}
                        style={{ top: 340, left: 570, width: 150 }}
                    />
                </div>
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Observaciones</label>
                <Textarea
                    {...register('observaciones')}
                    placeholder="Observaciones o notas clínicas..."
                    className="min-h-[80px]"
                />
            </div>
        </form>
    );
}
