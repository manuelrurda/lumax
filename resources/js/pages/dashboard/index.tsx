import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { FilesIcon, MailIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
];

export default function DashboardPage() {
    const { auth } = usePage<SharedData>().props;
    const greeting = auth.user.first_name;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inicio" />
            <div className="flex h-full flex-col items-center justify-center gap-8 p-8">
                <div className="mb-4 space-y-2 text-center">
                    <h1 className="text-4xl font-bold">Bienvenido, {greeting}</h1>
                    <p className="text-lg text-muted-foreground">
                        Seleccione una opción para continuar
                    </p>
                </div>

                <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                    <Link href="/inbox" className="block h-full">
                        <Card className="flex h-full cursor-pointer flex-col transition-all hover:scale-[1.02] hover:shadow-lg">
                            <CardHeader className="pb-4 text-center">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                                    <MailIcon className="h-10 w-10 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">
                                    Bandeja de entrada
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Ver y revisar documentos recibidos
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col justify-end pt-0">
                                <Button
                                    size="lg"
                                    className="h-12 w-full text-lg"
                                >
                                    Abrir bandeja de entrada
                                    <MailIcon className="ml-2 h-5 w-5" />
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Documentos */}
                    <Link href="/documents" className="block h-full">
                        <Card className="flex h-full cursor-pointer flex-col transition-all hover:scale-[1.02] hover:shadow-lg">
                            <CardHeader className="pb-4 text-center">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                                    <FilesIcon className="h-10 w-10 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">
                                    Documentos
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Subir, firmar y enviar documentos a otras
                                    personas
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col justify-end pt-0">
                                <Button
                                    size="lg"
                                    className="h-12 w-full text-lg"
                                >
                                    Ver mis documentos
                                    <FilesIcon className="ml-2 h-5 w-5" />
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
