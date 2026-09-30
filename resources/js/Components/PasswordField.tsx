import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import TextField, { type FieldIcon } from './TextField';

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    id: string;
    icon: FieldIcon;
    outlined?: boolean;
    invalid?: boolean;
    paddingStart?: number;
    paddingEnd?: number;
    paddingBlock?: number;
    /** Eye glyph box, in px. */
    toggleWidth?: number;
    toggleHeight?: number;
}

export default function PasswordField({
    toggleWidth = 16.5,
    toggleHeight = 11.25,
    ...props
}: PasswordFieldProps) {
    const [visible, setVisible] = useState(false);

    return (
        <TextField
            {...props}
            type={visible ? 'text' : 'password'}
            trailing={
                <button
                    type="button"
                    onClick={() => setVisible((current) => !current)}
                    aria-label={visible ? 'Hide password' : 'Show password'}
                    aria-pressed={visible}
                    className="absolute end-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-1 text-ink-faint transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40"
                >
                    <img
                        src="/images/auth/icon-eye.svg"
                        alt=""
                        aria-hidden="true"
                        style={{ width: `${toggleWidth}px`, height: `${toggleHeight}px` }}
                        className={visible ? 'opacity-100' : 'opacity-60'}
                    />
                </button>
            }
        />
    );
}
