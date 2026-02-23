export interface Note {
    id: number;
    slug: string;
    title: string;
    content: string;
    font_color: string;
    background_color: string;
    is_pinned: boolean;
    created_at: string;
    updated_at: string;
}