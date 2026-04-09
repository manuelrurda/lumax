import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface AppLayoutProps {
    children: ReactNode;
    backHref?: string;
    breadcrumbs?: BreadcrumbItem[];
}

interface PageProps {
    flash: {
        message?: string;
        error?: string;
    };
    errors: Record<string, string>;
}

export default ({
    children,
    backHref,
    breadcrumbs,
    ...props
}: AppLayoutProps) => {
    const { flash, errors } = usePage().props as unknown as PageProps;

    useEffect(() => {
        if (flash.message) {
            toast.success(flash.message);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
        if (Object.keys(errors).length > 0) {
            toast.error(Object.values(errors)[0]);
        }
    }, [flash, errors]);

    return (
        <AppLayoutTemplate
            backHref={backHref}
            breadcrumbs={breadcrumbs}
            {...props}
        >
            <Toaster />
            {children}
        </AppLayoutTemplate>
    );
};
