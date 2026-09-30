export type UserRole = 'user' | 'admin';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    created_at: string | null;
}

export interface FlashMessages {
    message: string | null;
    success: string | null;
    error: string | null;
}

export interface SharedProps {
    auth: {
        user: User | null;
    };
    flash: FlashMessages;
    /** Inertia's `usePage` requires page props to be index-signature compatible. */
    [key: string]: unknown;
}

export type PageProps<T = Record<string, unknown>> = T & SharedProps;
