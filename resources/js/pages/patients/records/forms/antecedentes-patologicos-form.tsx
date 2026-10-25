import React from 'react';
import { useFieldArray, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { FormSectionProps } from './antecedentes-no-patologicos-form';

const patologicosList = [
    { key: 'diabetes', label: 'Diabetes Mellitus' },
    { key: 'hipertension', label: 'Hipertensión arterial sistémica' },
    { key: 'enfermedades_corazon', label: 'Enfermedades del corazón' },
    { key: 'cancer', label: 'Cáncer' },
    { key: 'epilepsia', label: 'Convulsiones o epilepsia' },
] as const;

export function AntecedentesPatologicosForm({ register, control, watch }: FormSectionProps) {
    const watchOtrosPatologicos = watch('antecedentes_patologicos.otros') || [];
    const isLastRowInvalidPatologicos =
        watchOtrosPatologicos.length > 0 &&
        (!watchOtrosPatologicos[watchOtrosPatologicos.length - 1]?.key?.trim());

    const { fields: fieldsPatologicos, append: appendPatologicos, remove: removePatologicos } = useFieldArray({
        control,
        name: 'antecedentes_patologicos.otros',
    });

    return (
        <div className="space-y-4 border-t pt-6">
            <div>
                <h3 className="text-lg font-semibold text-lumax-purple">Antecedentes Patológicos</h3>
                <p className="text-sm text-muted-foreground mb-4">Enfermedades crónicas, cirugías previas y hospitalizaciones.</p>
            </div>
            
            <div className="grid gap-4">
                {patologicosList.map(({ key, label }) => (
                    <div key={key} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg bg-lumax-purple/5">
                        <div className="flex-1 basis-[35%]">
                            <Label className="text-base font-medium">{label}</Label>
                        </div>
                        <div className="flex-1 basis-[20%] flex flex-col gap-2">
                            <Label className="text-xs text-muted-foreground">¿Padece?</Label>
                            <Controller
                                control={control}
                                name={`antecedentes_patologicos.${key}.padece`}
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
                                {...register(`antecedentes_patologicos.${key}.tiempo_evolucion`)}
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
                            className="flex items-start gap-4 rounded-lg border bg-lumax-purple/5 p-4"
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
    );
}
