import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    processing?: boolean;
    /** Vertical padding in px. */
    paddingBlock?: number;
    labelClassName?: string;
}

export default function PrimaryButton({
    children,
    processing = false,
    paddingBlock = 14,
    labelClassName = 'text-[17px] leading-6 font-semibold',
    className = '',
    disabled,
    ...props
}: PrimaryButtonProps) {
    return (
        <button
            type="submit"
            disabled={disabled || processing}
            aria-busy={processing || undefined}
            style={{ paddingBlock: `${paddingBlock}px` }}
            className={[
                'flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 text-center text-white',
                'shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]',
                'transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/40',
                'disabled:cursor-not-allowed disabled:opacity-60',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...props}
        >
            <span className={labelClassName}>{children}</span>
            {processing ? (
                <svg
                    className="size-[13.333px] animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            ) : (
                <img
                    src="/images/auth/icon-arrow-right.svg"
                    alt=""
                    aria-hidden="true"
                    className="size-[13.333px] rtl:-scale-x-100"
                />
            )}
        </button>
    );
}
