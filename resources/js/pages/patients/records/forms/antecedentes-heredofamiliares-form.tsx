import React from 'react';
import { useFieldArray, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { FormSectionProps } from './antecedentes-no-patologicos-form';

const heredofamiliaresList = [
    { key: 'diabetes', label: 'Diabetes Mellitus' },
    { key: 'hipertension', label: 'Hipertensión arterial sistémica' },
    { key: 'cancer', label: 'Cáncer' },
    { key: 'glaucoma', label: 'Glaucoma' },
] as const;

export function AntecedentesHeredofamiliaresForm({ register, control, watch }: FormSectionProps) {
    const watchOtrosHeredofamiliares = watch('antecedentes_heredofamiliares.otros') || [];
    const isLastRowInvalidHeredofam =
        watchOtrosHeredofamiliares.length > 0 &&
        (!watchOtrosHeredofamiliares[watchOtrosHeredofamiliares.length - 1]?.key?.trim());

    const { fields: fieldsHeredo, append: appendHeredo, remove: removeHeredo } = useFieldArray({
        control,
        name: 'antecedentes_heredofamiliares.otros',
    });

    return (
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
                                name={`antecedentes_heredofamiliares.${key as any}.padece` as any}
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
                                {...register(`antecedentes_heredofamiliares.${key as any}.parentesco` as any)}
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
    );
}
