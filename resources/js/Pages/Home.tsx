import { Head, Link, usePage } from '@inertiajs/react';
import BrandMark from '@/Components/BrandMark';
import FlashAlerts from '@/Components/FlashAlerts';
import type { SharedProps } from '@/types';

export default function Home() {
    const { auth } = usePage<SharedProps>().props;

    return (
        <>
            <Head title="Welcome" />

            <div className="min-h-screen bg-surface">
                <header className="flex w-full flex-wrap items-center justify-between gap-4 bg-white px-6 py-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] sm:px-12">
                    <BrandMark />

                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={auth.user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                                className="rounded-lg bg-brand-600 px-4 py-2.5 text-xs leading-4 font-semibold text-white transition-colors hover:bg-brand-700"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="rounded-lg bg-field px-4 py-2.5 text-xs leading-4 font-semibold text-ink-muted transition-colors hover:bg-chip"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-lg bg-brand-600 px-4 py-2.5 text-xs leading-4 font-semibold text-white transition-colors hover:bg-brand-700"
                                >
                                    Create Account
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto flex w-full max-w-300 flex-col gap-6 px-6 py-16 sm:px-12">
                    <FlashAlerts />

                    <div className="flex flex-col gap-2">
                        <p className="text-5xl leading-none font-bold tracking-[-1px] text-brand-600">Tawla</p>
                        <h1 className="text-3xl leading-9.5 font-bold tracking-[-0.75px] text-ink">
                            {auth.user ? `Welcome back, ${auth.user.name}` : 'Welcome'}
                        </h1>
                        <p className="max-w-xl text-sm leading-[22.75px] text-ink-muted">
                            {auth.user
                                ? 'Head to your dashboard to continue.'
                                : 'Sign in to your account, or create a new one to get started.'}
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}
