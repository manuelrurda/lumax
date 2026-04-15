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
import { router } from '@inertiajs/react';
import {
    AntecedentesForm,
    defaultAntecedentes,
    defaultAntecedentesNoPatologicos,
    defaultAntecedentesPatologicos,
    defaultAntecedentesHeredofamiliares,
    TipoSangre,
    PatientAntecedentesTab
} from '../schemas/antecedentes-form';

const patologicosList = [
    { key: 'diabetes', label: 'Diabetes Mellitus' },
    { key: 'hipertension', label: 'Hipertensión arterial sistémica' },
    { key: 'enfermedades_corazon', label: 'Enfermedades del corazón' },
    { key: 'cancer', label: 'Cáncer' },
    { key: 'epilepsia', label: 'Convulsiones o epilepsia' },
] as const;

const heredofamiliaresList = [
    { key: 'diabetes', label: 'Diabetes Mellitus' },
    { key: 'hipertension', label: 'Hipertensión arterial sistémica' },
    { key: 'cancer', label: 'Cáncer' },
    { key: 'glaucoma', label: 'Glaucoma' },
] as const;

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
                tipo_sangre: (patient.antecedentes?.antecedentes_no_patologicos?.tipo_sangre as TipoSangre) || '',
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

    const watchOtros = watch('antecedentes_no_patologicos.otros') || [];
    const isLastRowInvalid =
        watchOtros.length > 0 &&
        (!watchOtros[watchOtros.length - 1]?.key?.trim() ||
         !watchOtros[watchOtros.length - 1]?.value?.trim());

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'antecedentes_no_patologicos.otros',
    });

    const watchOtrosPatologicos = watch('antecedentes_patologicos.otros') || [];
    const isLastRowInvalidPatologicos =
        watchOtrosPatologicos.length > 0 &&
        (!watchOtrosPatologicos[watchOtrosPatologicos.length - 1]?.key?.trim());

    const {
        fields: fieldsPatologicos,
        append: appendPatologicos,
        remove: removePatologicos
    } = useFieldArray({
        control,
        name: 'antecedentes_patologicos.otros',
    });

    const watchOtrosHeredofamiliares = watch('antecedentes_heredofamiliares.otros') || [];
    const isLastRowInvalidHeredofam =
        watchOtrosHeredofamiliares.length > 0 &&
        (!watchOtrosHeredofamiliares[watchOtrosHeredofamiliares.length - 1]?.key?.trim());

    const {
        fields: fieldsHeredo,
        append: appendHeredo,
        remove: removeHeredo
    } = useFieldArray({
        control,
        name: 'antecedentes_heredofamiliares.otros',
    });

    const onSubmit = (data: AntecedentesForm) => {
        setIsSaving(true);
        console.log('Enviando datos...', data);

        router.put(`/patients/${patient.id}`, {
            ...patient,
            antecedentes: data
        } as any, {
            onSuccess: () => {
                setIsSaving(false);
                reset({}, { keepValues: true }); // Reset isDirty state
            },
            onError: () => setIsSaving(false),
            preserveScroll: true
        });
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-xl border bg-card p-6 shadow-sm"
        >
            <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-semibold">
                    Antecedentes
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

            {/* SECCIÓN: NO PATOLÓGICOS */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-lumax-purple">Antecedentes No Patológicos</h3>
                    <p className="text-sm text-muted-foreground mb-4">Hábitos, estilo de vida y detalles perinatales.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="ocupacion">Ocupación</Label>
                        <Input
                            id="ocupacion"
                            {...register('antecedentes_no_patologicos.ocupacion')}
                            placeholder="Ej. Arquitecto"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="religion">Religión</Label>
                        <Input
                            id="religion"
                            {...register('antecedentes_no_patologicos.religion')}
                            placeholder="Ej. Católica"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Tipo de sangre</Label>
                        <Controller
                            control={control}
                            name="antecedentes_no_patologicos.tipo_sangre"
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
                            name="antecedentes_no_patologicos.fuma"
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
                            name="antecedentes_no_patologicos.toma"
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
                            name="antecedentes_no_patologicos.transfusiones"
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
                            {...register('antecedentes_no_patologicos.psicotropicos')}
                            placeholder="Especifique si aplica"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="alergias">Alergia a medicamentos</Label>
                        <Input
                            id="alergias"
                            {...register('antecedentes_no_patologicos.alergias')}
                            placeholder="Especifique las alergias o 'Ninguna'"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="perinatales">
                            Antecedentes Perinatales
                        </Label>
                        <Input
                            id="perinatales"
                            {...register('antecedentes_no_patologicos.perinatales')}
                            placeholder="Detalles de antecedentes perinatales"
                        />
                    </div>
                </div>

                {/* Dynamic Array 'Otros' */}
                <div className="mt-4 pt-4">
                    <div className="mb-4 flex items-center gap-4">
                        <h4 className="text-base font-medium">Otras condiciones no patológicas</h4>
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
                            No se han añadido otros antecedentes no patológicos.
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
                                            `antecedentes_no_patologicos.otros.${index}.key` as const,
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
                                            `antecedentes_no_patologicos.otros.${index}.value` as const,
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
            </div>

            {/* SECCIÓN: PATOLÓGICOS */}
            <div className="space-y-4 border-t pt-6">
                <div>
                    <h3 className="text-lg font-semibold text-lumax-purple">Antecedentes Patológicos</h3>
                    <p className="text-sm text-muted-foreground mb-4">Enfermedades crónicas, cirugías previas y hospitalizaciones.</p>
                </div>
                
                <div className="grid gap-4">
                    {patologicosList.map(({ key, label }) => (
                        <div key={key} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg bg-gray-50/50">
                            <div className="flex-1 basis-[35%]">
                                <Label className="text-base font-medium">{label}</Label>
                            </div>
                            <div className="flex-1 basis-[20%] flex flex-col gap-2">
                                <Label className="text-xs text-muted-foreground">¿Padece?</Label>
                                <Controller
                                    control={control}
                                    name={`antecedentes_patologicos.${key}.padece` as any}
                                    render={({ field }) => (
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value || 'no'}
                                            className="flex gap-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="sí" id={`pat-${key}-si`} />
                                                <Label htmlFor={`pat-${key}-si`} className="cursor-pointer font-normal">Sí</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="no" id={`pat-${key}-no`} />
                                                <Label htmlFor={`pat-${key}-no`} className="cursor-pointer font-normal">No</Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                            <div className="flex-1 basis-[45%] space-y-2">
                                <Label className="text-xs text-muted-foreground">Tiempo de evolución</Label>
                                <Input
                                    {...register(`antecedentes_patologicos.${key}.tiempo_evolucion` as any)}
                                    placeholder="Ej. 2 años"
                                    className="bg-white"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4">
                    <div className="mb-4 flex items-center gap-4">
                        <h4 className="text-base font-medium">Otras enfermedades patológicas</h4>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => appendPatologicos({ key: '', tiempo_evolucion: '' })}
                            disabled={isLastRowInvalidPatologicos}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Añadir otro
                        </Button>
                    </div>

                    {fieldsPatologicos.length === 0 && (
                        <p className="mb-2 text-sm text-muted-foreground italic">
                            No se han añadido otras enfermedades.
                        </p>
                    )}

                    <div className="space-y-4">
                        {fieldsPatologicos.map((field, index) => (
                            <div
                                key={field.id}
                                className="flex items-start gap-4 rounded-lg border bg-gray-50/50 p-4"
                            >
                                <div className="flex-1 space-y-2">
                                    <Label>Enfermedad / Cirugía</Label>
                                    <Input
                                        className="bg-white"
                                        placeholder="Nombre (Ej. Gastritis)"
                                        {...register(
                                            `antecedentes_patologicos.otros.${index}.key` as const,
                                            { required: true },
                                        )}
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label>Tiempo de evolución</Label>
                                    <Input
                                        className="bg-white"
                                        placeholder="Ej. 6 meses"
                                        {...register(
                                            `antecedentes_patologicos.otros.${index}.tiempo_evolucion` as const,
                                        )}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="mt-7 text-red-500 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => removePatologicos(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECCIÓN: HEREDOFAMILIARES */}
            <div className="space-y-4 border-t pt-6">
                <div>
                    <h3 className="text-lg font-semibold text-lumax-purple">Antecedentes Heredofamiliares</h3>
                    <p className="text-sm text-muted-foreground mb-4">Historial de enfermedades en la familia directa.</p>
                </div>
                
                <div className="grid gap-4">
                    {heredofamiliaresList.map(({ key, label }) => (
                        <div key={key} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg bg-gray-50/50">
                            <div className="flex-1 basis-[35%]">
                                <Label className="text-base font-medium">{label}</Label>
                            </div>
                            <div className="flex-1 basis-[20%] flex flex-col gap-2">
                                <Label className="text-xs text-muted-foreground">¿Padece un familiar?</Label>
                                <Controller
                                    control={control}
                                    name={`antecedentes_heredofamiliares.${key}.padece` as any}
                                    render={({ field }) => (
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value || 'no'}
                                            className="flex gap-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="sí" id={`hf-${key}-si`} />
                                                <Label htmlFor={`hf-${key}-si`} className="cursor-pointer font-normal">Sí</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="no" id={`hf-${key}-no`} />
                                                <Label htmlFor={`hf-${key}-no`} className="cursor-pointer font-normal">No</Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                            <div className="flex-1 basis-[45%] space-y-2">
                                <Label className="text-xs text-muted-foreground">Parentesco</Label>
                                <Input
                                    {...register(`antecedentes_heredofamiliares.${key}.parentesco` as any)}
                                    placeholder="Ej. Madre, Abuelo"
                                    className="bg-white"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4">
                    <div className="mb-4 flex items-center gap-4">
                        <h4 className="text-base font-medium">Otros antecedentes heredofamiliares</h4>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => appendHeredo({ key: '', parentesco: '' })}
                            disabled={isLastRowInvalidHeredofam}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Añadir otro
                        </Button>
                    </div>

                    {fieldsHeredo.length === 0 && (
                        <p className="mb-2 text-sm text-muted-foreground italic">
                            No se han añadido otras enfermedades en la familia.
                        </p>
                    )}

                    <div className="space-y-4">
                        {fieldsHeredo.map((field, index) => (
                            <div
                                key={field.id}
                                className="flex items-start gap-4 rounded-lg border bg-gray-50/50 p-4"
                            >
                                <div className="flex-1 space-y-2">
                                    <Label>Enfermedad</Label>
                                    <Input
                                        className="bg-white"
                                        placeholder="Nombre (Ej. Esquizofrenia)"
                                        {...register(
                                            `antecedentes_heredofamiliares.otros.${index}.key` as const,
                                            { required: true },
                                        )}
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label>Parentesco</Label>
                                    <Input
                                        className="bg-white"
                                        placeholder="Ej. Padre"
                                        {...register(
                                            `antecedentes_heredofamiliares.otros.${index}.parentesco` as const,
                                        )}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="mt-7 text-red-500 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => removeHeredo(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </form>
    );
}
