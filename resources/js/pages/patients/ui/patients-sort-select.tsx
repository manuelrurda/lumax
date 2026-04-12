import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowDownUp } from 'lucide-react';

interface PatientsSortSelectProps {
    value: string;
    onValueChange: (value: string) => void;
}

export function PatientsSortSelect({ value, onValueChange }: PatientsSortSelectProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" title="Ordenar">
                    <ArrowDownUp className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
                    <DropdownMenuRadioItem value="latest">Última actualización</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="name_asc">Nombre A - Z</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="name_desc">Nombre Z - A</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
