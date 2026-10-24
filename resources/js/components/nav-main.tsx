import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu className="pt-4">
                {items.map((item) => {
                    const isActive = page.url.startsWith(
                        typeof item.href === 'string'
                            ? item.href
                            : item.href.url,
                    );
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    className="flex justify-between"
                                >
                                    <div
                                        className={cn(
                                            'flex items-center gap-x-2',
                                            !isActive && 'text-primary/70',
                                        )}
                                    >
                                        {item.icon && (
                                            <item.icon className="w-4" />
                                        )}
                                        <span>{item.title}</span>
                                    </div>
                                    <div
                                        className={cn(
                                            'relative w-1 self-stretch bg-lumax-purple',
                                            !isActive && 'hidden',
                                        )}
                                    />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
