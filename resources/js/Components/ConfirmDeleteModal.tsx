import { router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

interface ConfirmDeleteModalProps {
    /** e.g. `Delete "John Doe"?` */
    title: string;
    deleteUrl: string;
    onClose: () => void;
}

export default function ConfirmDeleteModal({ title, deleteUrl, onClose }: ConfirmDeleteModalProps) {
    const [processing, setProcessing] = useState(false);

    const confirmDelete = () => {
        setProcessing(true);
        router.delete(deleteUrl, {
            onFinish: () => {
                setProcessing(false);
                onClose();
            },
        });
    };

    return (
        <Modal title={title} onClose={onClose}>
            <p className="text-sm leading-5 text-ink-muted">This action cannot be undone.</p>

            <div className="flex w-full items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg px-4 py-2.5 text-sm leading-5 font-semibold text-ink-muted transition-colors hover:bg-field"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={processing}
                    aria-busy={processing || undefined}
                    className="rounded-lg bg-red-600 px-5 py-2.5 text-sm leading-5 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? 'Deleting…' : 'Delete'}
                </button>
            </div>
        </Modal>
    );
}
