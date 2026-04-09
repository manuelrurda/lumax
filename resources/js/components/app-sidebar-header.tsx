import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link } from '@inertiajs/react';
import { MoveLeftIcon } from 'lucide-react';
import { Button } from './ui/button';

export function AppSidebarHeader({
    backHref,
    breadcrumbs = [],
}: {
    backHref?: string;
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="relative -ml-1 md:hidden" />
                {backHref && (
                    <Button variant="link" asChild>
                        <Link href={backHref}>
                            <MoveLeftIcon />
                            Atrás
                        </Link>
                    </Button>
                )}
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
