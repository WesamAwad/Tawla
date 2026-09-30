import { usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import type { SharedProps } from '@/types';

export default function Dashboard() {
    const { auth } = usePage<SharedProps>().props;

    return (
        <UserLayout title="Dashboard">
            <div className="flex w-full flex-col gap-2 rounded-xl bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                <p className="text-sm leading-5 text-ink-muted">
                    Signed in as {auth.user?.name} ({auth.user?.email}).
                </p>
            </div>
        </UserLayout>
    );
}
