interface BrandMarkProps {
    tagline?: string;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

export default function BrandMark({ tagline }: BrandMarkProps) {
    return (
        <div className="flex shrink-0 items-center gap-3">
            <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-lg leading-none font-bold text-white"
            >
                {appName.charAt(0).toUpperCase()}
            </span>
            <span className="flex flex-col">
                <span className="text-[17px] leading-6 font-bold tracking-[-0.425px] text-ink">{appName}</span>
                {tagline && <span className="text-xs leading-[18px] text-ink-muted">{tagline}</span>}
            </span>
        </div>
    );
}
