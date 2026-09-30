import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import FieldLabel from '@/Components/FieldLabel';
import InputError from '@/Components/InputError';
import PasswordField from '@/Components/PasswordField';
import PasswordStrength from '@/Components/PasswordStrength';
import PrimaryButton from '@/Components/PrimaryButton';
import TextField from '@/Components/TextField';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/register', { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <GuestLayout
            title="Create Account"
            heading="Create your account"
            description="Fill in your details to get started."
            footer={
                <>
                    <span className="text-ink-muted">Already have an account?</span>
                    <Link href="/login" className="font-semibold text-brand-600 hover:underline">
                        Sign In
                    </Link>
                </>
            }
        >
            <form onSubmit={submit} className="flex w-full flex-col gap-5" noValidate>
                <div className="flex w-full flex-col gap-2">
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <TextField
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        icon={{ src: '/images/auth/icon-user.svg', width: 16, height: 16, left: 20 }}
                        placeholder="First and Last Name"
                        value={data.name}
                        invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        onChange={(event) => setData('name', event.target.value)}
                    />
                    <InputError id="name-error" message={errors.name} />
                </div>

                <div className="flex w-full flex-col gap-2">
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <TextField
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
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
                        autoComplete="new-password"
                        paddingEnd={44}
                        icon={{ src: '/images/auth/icon-lock.svg', width: 16, height: 21, left: 20 }}
                        placeholder="••••••••"
                        value={data.password}
                        invalid={Boolean(errors.password)}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                        onChange={(event) => setData('password', event.target.value)}
                    />
                    <InputError id="password-error" message={errors.password} />
                </div>

                <div className="flex w-full flex-col gap-2">
                    <FieldLabel htmlFor="password_confirmation">Confirm Password</FieldLabel>
                    <PasswordField
                        id="password_confirmation"
                        name="password_confirmation"
                        autoComplete="new-password"
                        paddingEnd={44}
                        icon={{ src: '/images/auth/icon-shield-check.svg', width: 20, height: 20, left: 18 }}
                        placeholder="••••••••"
                        value={data.password_confirmation}
                        invalid={Boolean(errors.password_confirmation)}
                        aria-describedby={errors.password_confirmation ? 'password-confirmation-error' : undefined}
                        onChange={(event) => setData('password_confirmation', event.target.value)}
                    />
                    <InputError id="password-confirmation-error" message={errors.password_confirmation} />
                </div>

                <PasswordStrength password={data.password} />

                <PrimaryButton processing={processing} labelClassName="text-sm leading-5 font-semibold">
                    Create Account
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
