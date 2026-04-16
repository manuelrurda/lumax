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
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import {
    Control,
    Controller,
    UseFormRegister,
    UseFormWatch,
    useFieldArray,
} from 'react-hook-form';
import { AntecedentesForm } from '../schemas/antecedentes';

export interface FormSectionProps {
    register: UseFormRegister<AntecedentesForm>;
    control: Control<AntecedentesForm>;
    watch: UseFormWatch<AntecedentesForm>;
}

export function AntecedentesNoPatologicosForm({
    register,
    control,
    watch,
}: FormSectionProps) {
    const watchOtros = watch('antecedentes_no_patologicos.otros') || [];
    const isLastRowInvalid =
        watchOtros.length > 0 &&
        (!watchOtros[watchOtros.length - 1]?.key?.trim() ||
            !watchOtros[watchOtros.length - 1]?.value?.trim());

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'antecedentes_no_patologicos.otros',
    });

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-lumax-purple">
                    Antecedentes No Patológicos
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                    Hábitos, estilo de vida y detalles perinatales.
                </p>
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
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 pb-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="psicotropicos">Psicotrópicos</Label>
                    <Textarea
                        id="psicotropicos"
                        className="h-24 resize-none bg-white"
                        {...register(
                            'antecedentes_no_patologicos.psicotropicos',
                        )}
                        placeholder="Especifique si aplica"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="alergias">Alergia a medicamentos</Label>
                    <Textarea
                        id="alergias"
                        className="h-24 resize-none bg-white"
                        {...register('antecedentes_no_patologicos.alergias')}
                        placeholder="Especifique las alergias o 'Ninguna'"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="perinatales">
                        Antecedentes Perinatales
                    </Label>
                    <Textarea
                        id="perinatales"
                        className="h-24 resize-none bg-white"
                        {...register('antecedentes_no_patologicos.perinatales')}
                        placeholder="Detalles de antecedentes perinatales"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="medicamentos_actuales">
                        Medicamentos que utiliza actualmente
                    </Label>
                    <Textarea
                        id="medicamentos_actuales"
                        className="h-24 resize-none bg-white"
                        {...register(
                            'antecedentes_no_patologicos.medicamentos_actuales',
                        )}
                        placeholder="Liste los medicamentos o 'Ninguno'"
                    />
                </div>
            </div>

            {/* Dynamic Array 'Otros' */}
            <div className="mt-4 pt-4">
                <div className="mb-4 flex items-center gap-4">
                    <h4 className="text-base font-medium">
                        Otras condiciones no patológicas
                    </h4>
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
    );
}
