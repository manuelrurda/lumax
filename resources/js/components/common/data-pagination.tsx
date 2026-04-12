import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginatedData } from '@/types';

export function DataPagination({ data }: { data: PaginatedData<any> }) {
    if (!data || data.total === 0) return null;

    return (
        <div className="mt-4 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-muted-foreground">
                Mostrando {data.from || 0} a {data.to || 0} de {data.total} registros
            </div>

            <Pagination className="mx-0 w-auto">
                <PaginationContent>
                    {data.links.map((link, i) => {
                        const isPrevious = link.label.includes('Previous');
                        const isNext = link.label.includes('Next');

                        if (!link.url && (isPrevious || isNext)) {
                            return null;
                        }

                        if (isPrevious) {
                            return (
                                <PaginationItem key={i}>
                                    <PaginationPrevious href={link.url || ''} />
                                </PaginationItem>
                            );
                        }

                        if (isNext) {
                            return (
                                <PaginationItem key={i}>
                                    <PaginationNext href={link.url || ''} />
                                </PaginationItem>
                            );
                        }

                        if (link.label === '...') {
                            return (
                                <PaginationItem key={i}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }

                        return (
                            <PaginationItem key={i}>
                                <PaginationLink href={link.url || ''} isActive={link.active}>
                                    {link.label}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}
                </PaginationContent>
            </Pagination>
        </div>
    );
}
