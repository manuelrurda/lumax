import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';

interface Props {
    route: string;
    defaultValue?: string;
    debounceMs?: number;
}

export const SearchBar = ({
    route,
    defaultValue = '',
    debounceMs = 600,
}: Props) => {
    const [searchTerm, setSearchTerm] = useState<string>(defaultValue || '');

    useEffect(() => {
        setSearchTerm(defaultValue || '');
    }, [defaultValue]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== (defaultValue || '')) {
                router.get(
                    route,
                    { search: searchTerm || null },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                    },
                );
            }
        }, debounceMs);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, debounceMs, route, defaultValue]);

    return (
        <InputGroup>
            <InputGroupInput
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
        </InputGroup>
    );
};
