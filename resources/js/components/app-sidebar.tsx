import { BugReportDialog } from '@/components/bug-report/bug-report-dialog';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { CalendarDays, MessageSquareWarning, UsersRound } from 'lucide-react';
import AppLogo from './app-logo';
import { NavUser } from './nav-user';

const mainNavItems: NavItem[] = [
    {
        title: 'Pacientes',
        href: '/patients',
        icon: UsersRound,
    },
    {
        title: 'Citas',
        href: '/appointments',
        icon: CalendarDays,
    },
    {
        title: 'Reportes',
        href: '/bug-reports',
        icon: MessageSquareWarning,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/patients" prefetch>
                                <div className="h-full w-full">
                                    <AppLogo />
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <BugReportDialog />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
