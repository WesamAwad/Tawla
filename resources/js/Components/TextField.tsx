import type { InputHTMLAttributes, ReactNode } from 'react';

export interface FieldIcon {
    src: string;
    /** Rendered icon box, in px. */
    width: number;
    height: number;
    /** Distance from the inline start edge of the input, in px. */
    left: number;
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    icon: FieldIcon;
    /** Draws a visible border around the field. */
    outlined?: boolean;
    invalid?: boolean;
    /** Padding-inline-end in px — widened when a trailing control sits inside the field. */
    paddingEnd?: number;
    paddingBlock?: number;
    paddingStart?: number;
    trailing?: ReactNode;
}

export default function TextField({
    id,
    icon,
    outlined = false,
    invalid = false,
    paddingStart = 48,
    paddingEnd = 16,
    paddingBlock = 16,
    trailing,
    className = '',
    ...props
}: TextFieldProps) {
    return (
        <div className="relative flex w-full items-center">
            <input
                id={id}
                aria-invalid={invalid || undefined}
                style={{
                    paddingInlineStart: `${paddingStart}px`,
                    paddingInlineEnd: `${paddingEnd}px`,
                    paddingBlock: `${paddingBlock}px`,
                }}
                className={[
                    'w-full rounded-lg bg-field text-sm leading-normal text-ink',
                    'placeholder:text-ink-faint',
                    'transition-[border-color,box-shadow] duration-150',
                    'focus:outline-none focus:border-brand-600 focus:ring-3 focus:ring-brand-600/20',
                    outlined ? 'border border-solid' : 'border border-solid border-transparent',
                    invalid ? 'border-red-500' : outlined ? 'border-[#6b7280]' : '',
                    className,
                ]
                    .filter(Boolean)
                    .join(' ')}
                {...props}
            />
            <img
                src={icon.src}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 -translate-y-1/2"
                style={{
                    insetInlineStart: `${icon.left}px`,
                    width: `${icon.width}px`,
                    height: `${icon.height}px`,
                }}
            />
            {trailing}
        </div>
    );
}
