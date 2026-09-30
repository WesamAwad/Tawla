import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center overflow-y-auto bg-ink/60 p-4">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="fixed inset-0 cursor-default"
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="relative flex w-full max-w-md flex-col gap-5 rounded-xl bg-white p-6 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]"
            >
                <h2 className="text-lg leading-7 font-bold text-ink">{title}</h2>
                {children}
            </div>
        </div>
    );
}
