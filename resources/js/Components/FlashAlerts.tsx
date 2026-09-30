import { usePage } from '@inertiajs/react';
import type { SharedProps } from '@/types';

/** Renders the session flash messages shared by `HandleInertiaRequests`. */
export default function FlashAlerts() {
    const { flash } = usePage<SharedProps>().props;

    return (
        <>
            {flash.success && (
                <div role="status" className="rounded-lg bg-brand-50 px-4 py-3 text-sm leading-5 font-medium text-brand-600">
                    {flash.success}
                </div>
            )}
            {flash.message && (
                <div role="status" className="rounded-lg bg-field px-4 py-3 text-sm leading-5 font-medium text-ink-muted">
                    {flash.message}
                </div>
            )}
            {flash.error && (
                <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm leading-5 font-medium text-red-600">
                    {flash.error}
                </div>
            )}
        </>
    );
}
