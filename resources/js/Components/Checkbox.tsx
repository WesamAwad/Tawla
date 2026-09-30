import type { InputHTMLAttributes, ReactNode } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    id: string;
    children: ReactNode;
    /** Control box size in px. */
    boxSize?: number;
    radius?: number;
    gap?: number;
    labelClassName?: string;
    alignStart?: boolean;
}

export default function Checkbox({
    id,
    children,
    boxSize = 20,
    radius = 2.5,
    gap = 12,
    labelClassName = 'text-sm leading-[19.25px] text-ink-muted',
    alignStart = false,
    ...props
}: CheckboxProps) {
    return (
        <div className={`flex w-full ${alignStart ? 'items-start' : 'items-center'}`} style={{ gap: `${gap}px` }}>
            <span
                className="relative inline-flex shrink-0"
                style={{ width: `${boxSize}px`, height: `${boxSize}px`, marginTop: alignStart ? '2px' : undefined }}
            >
                <input
                    id={id}
                    type="checkbox"
                    className="peer size-full cursor-pointer appearance-none border border-field-line bg-field transition-colors checked:border-brand-600 checked:bg-brand-600 focus:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/25"
                    style={{ borderRadius: `${radius}px` }}
                    {...props}
                />
                <img
                    src="/images/auth/icon-check.svg"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-1/2 w-[55%] -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100"
                />
            </span>
            <label htmlFor={id} className={`cursor-pointer ${labelClassName}`}>
                {children}
            </label>
        </div>
    );
}
