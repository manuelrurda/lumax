export interface PaginationLink {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}

export interface Paginator<T> {
    current_page: number;
    data: T[];
    links: PaginationLink[];
    prev_page_url: string | null;
    next_page_url: string | null;
}
