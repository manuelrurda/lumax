import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { PatientRecordLayout } from './ui/patient-record-layout';
import { PatientAntecedentesTab } from './schemas/antecedentes-form';
import { useForm, Controller } from 'react-hook-form';
import { AntecedentesOftalmologicosForm, defaultAntecedentesOftalmologicos } from './schemas/antecedentes-oftalmologicos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Save } from 'lucide-react';

export default function PatientOftalmologicos({ patient }: { patient: PatientAntecedentesTab }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Pacientes', href: '/patients' },
        { title: `${patient.first_name} ${patient.last_name}`, href: `/patients/${patient.id}` },
    ];

    const { register, control, handleSubmit, formState: { isDirty } } = useForm<AntecedentesOftalmologicosForm>({
        defaultValues: defaultAntecedentesOftalmologicos,
    });

    const onSubmit = (data: AntecedentesOftalmologicosForm) => {
        console.log('Mock save:', data);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Antecedentes Oftalmológicos: ${patient.first_name}`} />
            
            <PatientRecordLayout patient={patient} currentTab="oftalmologicos">
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
                            disabled={!isDirty}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Guardar cambios
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:divide-x divide-border">
                        {/* Lentes Aéreos */}
                        <div className="space-y-6 lg:pr-4">
                            <h3 className="text-lg font-medium tracking-tight border-b pb-2">
                                Lentes aéreos
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Última refracción</Label>
                                    <Input {...register('lentes_aereos.ultima_refraccion')} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Gotas</Label>
                                    <Input {...register('lentes_aereos.gotas')} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Cirugías previas</Label>
                                    <Input {...register('lentes_aereos.cirugias_previas')} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Glaucoma</Label>
                                    <Input {...register('lentes_aereos.glaucoma')} />
                                </div>
                            </div>
                        </div>

                        {/* Lentes de Contacto */}
                        <div className="space-y-6 lg:pl-10 pt-6 lg:pt-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-2">
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
                                                    onCheckedChange={field.onChange}
                                                />
                                            )}
                                        />
                                        <Label htmlFor="blandos" className="cursor-pointer">
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
                                                    onCheckedChange={field.onChange}
                                                />
                                            )}
                                        />
                                        <Label htmlFor="rigidos" className="cursor-pointer">
                                            Rígidos
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Última refracción</Label>
                                    <Input {...register('lentes_contacto.ultima_refraccion')} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Trauma ocular</Label>
                                    <Input {...register('lentes_contacto.trauma_ocular')} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Láser</Label>
                                    <Input {...register('lentes_contacto.laser')} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Otros</Label>
                                    <Input {...register('lentes_contacto.otros')} />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </PatientRecordLayout>
        </AppLayout>
    );
}
