import type { ReactNode } from 'react';

interface FieldLabelProps {
    htmlFor: string;
    children: ReactNode;
    /** Right-aligned slot — "Required", "Optional", "Forgot Password?" etc. */
    aside?: ReactNode;
}

export default function FieldLabel({ htmlFor, children, aside }: FieldLabelProps) {
    return (
        <div className="flex w-full items-center justify-between gap-2">
            <label htmlFor={htmlFor} className="text-sm leading-5 font-semibold text-ink">
                {children}
            </label>
            {aside}
        </div>
    );
}
