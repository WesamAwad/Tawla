const LEVELS = ['Too Short', 'Weak', 'Fair', 'Good', 'Strong & Secure'] as const;

/**
 * Scores a password from 0–4 against the same shape the backend enforces
 * (Laravel's `Password::defaults()` — minimum eight characters).
 */
export function scorePassword(password: string): number {
    if (password.length < 8) {
        return 0;
    }

    let score = 1;

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
        score += 1;
    }

    if (/\d/.test(password)) {
        score += 1;
    }

    if (/[^A-Za-z0-9]/.test(password) || password.length >= 14) {
        score += 1;
    }

    return score;
}

interface PasswordStrengthProps {
    password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
    const score = scorePassword(password);

    return (
        <div className="flex w-full flex-col gap-1.5 rounded-lg bg-field p-3">
            <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                    <img
                        src="/images/auth/icon-shield-sm.svg"
                        alt=""
                        aria-hidden="true"
                        className="h-[11.667px] w-[9.333px]"
                    />
                    <span className="text-xs leading-4 font-semibold text-ink-muted">Password Strength:</span>
                </div>
                <span className="text-sm leading-5 font-semibold text-brand-600" aria-live="polite">
                    {LEVELS[score]}
                </span>
            </div>
            <div
                className="flex h-1.5 w-full items-start justify-center gap-1.5"
                role="meter"
                aria-valuemin={0}
                aria-valuemax={4}
                aria-valuenow={score}
                aria-valuetext={LEVELS[score]}
                aria-label="Password strength"
            >
                {[0, 1, 2, 3].map((index) => (
                    <span
                        key={index}
                        className={[
                            'h-full min-w-px flex-1 rounded-full transition-colors',
                            index < score - 1 ? 'bg-brand-600' : index === score - 1 ? 'bg-brand-500' : 'bg-field-line',
                        ].join(' ')}
                    />
                ))}
            </div>
        </div>
    );
}
