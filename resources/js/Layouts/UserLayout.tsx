import { Head, Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import BrandMark from '@/Components/BrandMark';
import FlashAlerts from '@/Components/FlashAlerts';
import type { SharedProps } from '@/types';

interface UserLayoutProps {
    title: string;
    children: ReactNode;
}

export default function UserLayout({ title, children }: UserLayoutProps) {
    const { auth } = usePage<SharedProps>().props;

    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-surface">
                <header className="flex w-full flex-wrap items-center justify-between gap-4 bg-white px-6 py-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] sm:px-12">
                    <Link href="/">
                        <BrandMark />
                    </Link>

                    <div className="flex items-center gap-3">
                        <span className="hidden text-xs leading-4 text-ink-muted sm:inline">{auth.user?.name}</span>
                        {auth.user?.role === 'admin' && (
                            <Link
                                href="/admin/dashboard"
                                className="rounded-lg bg-brand-50 px-4 py-2.5 text-xs leading-4 font-semibold text-brand-600 transition-colors hover:bg-brand-100"
                            >
                                Admin Panel
                            </Link>
                        )}
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="rounded-lg bg-field px-4 py-2.5 text-xs leading-4 font-semibold text-ink-muted transition-colors hover:bg-chip"
                        >
                            Sign out
                        </Link>
                    </div>
                </header>

                <main className="mx-auto flex w-full max-w-300 flex-col gap-6 px-6 py-8 sm:px-12">
                    <FlashAlerts />

                    <h1 className="text-2xl leading-8 font-bold tracking-[-0.5px] text-ink">{title}</h1>

                    {children}
                </main>
            </div>
        </>
    );
}
