import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import Checkbox from '@/Components/Checkbox';
import FieldLabel from '@/Components/FieldLabel';
import InputError from '@/Components/InputError';
import PasswordField from '@/Components/PasswordField';
import PrimaryButton from '@/Components/PrimaryButton';
import TextField from '@/Components/TextField';
import GuestLayout from '@/Layouts/GuestLayout';

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/login', { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout
            title="Sign In"
            heading="Welcome back"
            description="Sign in to your account to continue."
            footer={
                <>
                    <span className="text-ink-muted">Don&apos;t have an account?</span>
                    <Link href="/register" className="font-semibold text-brand-600 hover:underline">
                        Create Account
                    </Link>
                </>
            }
        >
            {status && (
                <div role="status" className="rounded-lg bg-brand-50 px-4 py-3 text-sm leading-5 font-medium text-brand-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="flex w-full flex-col gap-5" noValidate>
                <div className="flex w-full flex-col gap-2">
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <TextField
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="username"
                        icon={{ src: '/images/auth/icon-mail.svg', width: 20, height: 16, left: 18 }}
                        placeholder="name@example.com"
                        value={data.email}
                        invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        onChange={(event) => setData('email', event.target.value)}
                    />
                    <InputError id="email-error" message={errors.email} />
                </div>

                <div className="flex w-full flex-col gap-2">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <PasswordField
                        id="password"
                        name="password"
                        autoComplete="current-password"
                        paddingEnd={44}
                        icon={{ src: '/images/auth/icon-lock.svg', width: 16, height: 21, left: 20 }}
                        placeholder="Enter your password"
                        value={data.password}
                        invalid={Boolean(errors.password)}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                        onChange={(event) => setData('password', event.target.value)}
                    />
                    <InputError id="password-error" message={errors.password} />
                </div>

                <Checkbox
                    id="remember"
                    name="remember"
                    checked={data.remember}
                    onChange={(event) => setData('remember', event.target.checked)}
                >
                    Remember me
                </Checkbox>

                <PrimaryButton processing={processing} labelClassName="text-sm leading-5 font-semibold">
                    Sign In
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
