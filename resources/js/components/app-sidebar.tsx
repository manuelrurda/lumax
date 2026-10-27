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
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CalendarDays, MessageSquareWarning, UsersRound } from 'lucide-react';
import AppLogo from './app-logo';
import { NavUser } from './nav-user';

const baseNavItems: NavItem[] = [
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
];

const bugReportsNavItem: NavItem = {
    title: 'Reportes',
    href: '/bug-reports',
    icon: MessageSquareWarning,
};

export function AppSidebar() {
    const { props } = usePage<SharedData>();
    const canAccessBugReports = props.bugReports?.canAccess ?? false;
    const mainNavItems = canAccessBugReports
        ? [...baseNavItems, bugReportsNavItem]
        : baseNavItems;

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
                {canAccessBugReports && <BugReportDialog />}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
