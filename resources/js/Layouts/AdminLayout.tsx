import { Head, Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import BrandMark from '@/Components/BrandMark';
import FlashAlerts from '@/Components/FlashAlerts';
import type { SharedProps } from '@/types';

interface AdminLayoutProps {
    title: string;
    children: ReactNode;
}

const NAV_ITEMS = [{ label: 'Dashboard', href: '/admin/dashboard' }];

export default function AdminLayout({ title, children }: AdminLayoutProps) {
    const page = usePage<SharedProps>();
    const { auth } = page.props;

    return (
        <>
            <Head title={`Admin — ${title}`} />

            <div className="min-h-screen bg-surface">
                <header className="flex w-full flex-wrap items-center justify-between gap-4 bg-white px-6 py-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] sm:px-12">
                    <Link href="/admin/dashboard">
                        <BrandMark tagline="Admin Panel" />
                    </Link>

                    <div className="flex items-center gap-3">
                        <span className="hidden text-xs leading-4 text-ink-muted sm:inline">{auth.user?.name}</span>
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

                <div className="mx-auto flex w-full max-w-300 flex-col gap-6 px-6 py-8 sm:flex-row sm:px-12">
                    <nav className="flex shrink-0 gap-1 overflow-x-auto sm:w-48 sm:flex-col sm:overflow-visible">
                        {NAV_ITEMS.map((item) => {
                            const path = page.url.split(/[?#]/)[0];
                            const active = path === item.href || path.startsWith(`${item.href}/`);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`shrink-0 rounded-lg px-3 py-2 text-sm leading-5 font-semibold transition-colors ${
                                        active ? 'bg-brand-50 text-brand-600' : 'text-ink-muted hover:bg-field'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <main className="flex min-w-0 flex-1 flex-col gap-6">
                        <FlashAlerts />

                        <h1 className="text-2xl leading-8 font-bold tracking-[-0.5px] text-ink">{title}</h1>

                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
