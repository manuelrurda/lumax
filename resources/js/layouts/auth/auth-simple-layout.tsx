import AppLogo from '@/components/app-logo';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-svh">
            <div className="flex w-full border-b p-6">
                <Link href={home()}>
                    <div className="flex h-18">
                        <AppLogo />
                    </div>
                </Link>
            </div>
            <div className="flex flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
                <div className="space-y-2 text-center">
                    <h1 className="text-xl font-medium">{title}</h1>
                    <p className="text-center text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8">{children}</div>
                </div>
            </div>
        </div>
    );
}
