import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import BrandMark from '@/Components/BrandMark';

interface GuestLayoutProps {
    title: string;
    heading: string;
    description: string;
    /** Shown under the card — typically a link to the other auth screen. */
    footer: ReactNode;
    children: ReactNode;
}

/** Centered card used by the sign-in and registration screens. */
export default function GuestLayout({ title, heading, description, footer, children }: GuestLayoutProps) {
    return (
        <>
            <Head title={title} />

            <div className="flex min-h-screen items-center justify-center bg-surface px-6 py-12">
                <div className="flex w-full max-w-md flex-col gap-8 rounded-xl bg-white p-8 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] sm:p-10">
                    <header className="flex flex-col gap-6">
                        <Link href="/" className="self-start">
                            <BrandMark />
                        </Link>

                        <div className="flex flex-col gap-1.5">
                            <h1 className="text-3xl leading-9.5 font-bold tracking-[-0.75px] text-ink">{heading}</h1>
                            <p className="text-sm leading-[22.75px] text-ink-muted">{description}</p>
                        </div>
                    </header>

                    {children}

                    <footer className="flex flex-wrap items-center justify-center gap-1 text-sm leading-5.5">
                        {footer}
                    </footer>
                </div>
            </div>
        </>
    );
}
