import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginationLink as PaginationLinkItem } from '@/lib/types';

interface Props {
    links: PaginationLinkItem[];
    prevUrl: string | null;
    nextUrl: string | null;
}

export const CustomPagination = ({ links, prevUrl, nextUrl }: Props) => {
    const cleanLinks = links.slice(1, -1);
    return (
        <Pagination>
            <PaginationContent>
                {prevUrl && (
                    <PaginationItem>
                        <PaginationPrevious href={prevUrl || '#'} />
                    </PaginationItem>
                )}
                {cleanLinks.map((link, index) => {
                    const isEllipsis = link.label === '...';
                    return (
                        <PaginationItem key={index}>
                            {isEllipsis ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    href={link.url || '#'}
                                    isActive={link.active}
                                >
                                    {link.label}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    );
                })}
                {nextUrl && (
                    <PaginationItem>
                        <PaginationNext href={nextUrl || '#'} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
};
