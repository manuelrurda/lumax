import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { LoaderCircle, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
    AntecedentesNoPatologicosForm,
    defaultAntecedentes,
    TipoSangre,
    PatientAntecedentesTab
} from '../schemas/antecedentes-form';

export function AntecedentesNoPatologicosTab({
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
        formState: { isDirty },
    } = useForm<AntecedentesNoPatologicosForm>({
        defaultValues: {
            ...defaultAntecedentes,
            ...(patient.antecedentes || {}),
            tipo_sangre:
                (patient.antecedentes?.tipo_sangre as TipoSangre) || '',
        } as AntecedentesNoPatologicosForm,
    });

    const watchOtros = watch('otros') || [];
    const isLastRowInvalid =
        watchOtros.length > 0 &&
        (!watchOtros[watchOtros.length - 1]?.key?.trim() ||
         !watchOtros[watchOtros.length - 1]?.value?.trim());

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'otros',
    });

    const onSubmit = (data: AntecedentesNoPatologicosForm) => {
        setIsSaving(true);
        console.log('Form data:', data);

        // Simular petición para enfocarnos solo en UI
        setTimeout(() => {
            setIsSaving(false);
        }, 800);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-xl border bg-card p-6 shadow-sm"
        >
            <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-semibold">
                    Antecedentes No Patológicos
                </h2>
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

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="ocupacion">Ocupación</Label>
                    <Input
                        id="ocupacion"
                        {...register('ocupacion')}
                        placeholder="Ej. Arquitecto"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="religion">Religión</Label>
                    <Input
                        id="religion"
                        {...register('religion')}
                        placeholder="Ej. Católica"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Tipo de sangre</Label>
                    <Controller
                        control={control}
                        name="tipo_sangre"
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value || undefined}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione el tipo de sangre" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        'A+',
                                        'A-',
                                        'B+',
                                        'B-',
                                        'AB+',
                                        'AB-',
                                        'O+',
                                        'O-',
                                    ].map((t) => (
                                        <SelectItem key={t} value={t}>
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Fuma</Label>
                    <Controller
                        control={control}
                        name="fuma"
                        render={({ field }) => (
                            <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value || 'no'}
                                className="mt-2 flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="sí" id="fuma-si" />
                                    <Label
                                        htmlFor="fuma-si"
                                        className="cursor-pointer font-normal"
                                    >
                                        Sí
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="fuma-no" />
                                    <Label
                                        htmlFor="fuma-no"
                                        className="cursor-pointer font-normal"
                                    >
                                        No
                                    </Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Toma</Label>
                    <Controller
                        control={control}
                        name="toma"
                        render={({ field }) => (
                            <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value || 'no'}
                                className="mt-2 flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="sí" id="toma-si" />
                                    <Label
                                        htmlFor="toma-si"
                                        className="cursor-pointer font-normal"
                                    >
                                        Sí
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="toma-no" />
                                    <Label
                                        htmlFor="toma-no"
                                        className="cursor-pointer font-normal"
                                    >
                                        No
                                    </Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Transfusiones</Label>
                    <Controller
                        control={control}
                        name="transfusiones"
                        render={({ field }) => (
                            <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value || 'no'}
                                className="mt-2 flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="sí"
                                        id="transfusiones-si"
                                    />
                                    <Label
                                        htmlFor="transfusiones-si"
                                        className="cursor-pointer font-normal"
                                    >
                                        Sí
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="no"
                                        id="transfusiones-no"
                                    />
                                    <Label
                                        htmlFor="transfusiones-no"
                                        className="cursor-pointer font-normal"
                                    >
                                        No
                                    </Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="psicotropicos">Psicotrópicos</Label>
                    <Input
                        id="psicotropicos"
                        {...register('psicotropicos')}
                        placeholder="Especifique si aplica"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="alergias">Alergia a medicamentos</Label>
                    <Input
                        id="alergias"
                        {...register('alergias')}
                        placeholder="Especifique las alergias o 'Ninguna'"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="perinatales">
                        Antecedentes Perinatales
                    </Label>
                    <Input
                        id="perinatales"
                        {...register('perinatales')}
                        placeholder="Detalles de antecedentes perinatales"
                    />
                </div>
            </div>

            {/* Dynamic Array 'Otros' */}
            <div className="mt-6 border-t pt-6">
                <div className="mb-4 flex items-center gap-4">
                    <h3 className="text-lg font-semibold">Otros</h3>
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => append({ key: '', value: '' })}
                        disabled={isLastRowInvalid}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Añadir otro
                    </Button>
                </div>

                {fields.length === 0 && (
                    <p className="mb-2 text-sm text-muted-foreground italic">
                        No se han añadido otros antecedentes.
                    </p>
                )}

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="flex items-start gap-4 rounded-lg border bg-gray-50/50 p-4"
                        >
                            <div className="flex-1 space-y-2">
                                <Label>Nombre del antecedente</Label>
                                <Input
                                    className="bg-white"
                                    placeholder="Nombre / Clave (Ej. Tatuajes)"
                                    {...register(
                                        `otros.${index}.key` as const,
                                        { required: true },
                                    )}
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label>Detalle / Valor</Label>
                                <Input
                                    className="bg-white"
                                    placeholder="Valor / Detalle"
                                    {...register(
                                        `otros.${index}.value` as const,
                                        { required: true },
                                    )}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="mt-7 text-red-500 hover:bg-red-50 hover:text-red-700"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </form>
    );
}
