import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    bugReports: { canAccess: boolean; uploadsEnabled: boolean };
    [key: string]: unknown;
}

export interface BugReportAttachment {
    id: number;
    bug_report_id: number;
    kind: 'screenshot' | 'attachment';
    file_url: string;
    file_name: string;
    file_type: string | null;
    file_size: number | null;
    created_at: string;
    updated_at: string;
}

export interface BugReport {
    id: number;
    user_id: number;
    type: 'bug' | 'mejora';
    title: string;
    description: string;
    page_path: string;
    page_url: string | null;
    page_component: string | null;
    user_agent: string | null;
    viewport: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    user?: User;
    attachments?: BugReportAttachment[];
    attachments_count?: number;
}

export interface User {
    id: number;
    first_name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Patient {
    id: number;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    updated_at: string;
    future_appointments_count?: number;
    deleted_at?: string | null;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
}
