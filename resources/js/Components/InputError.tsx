interface InputErrorProps {
    id?: string;
    message?: string;
}

export default function InputError({ id, message }: InputErrorProps) {
    if (!message) {
        return null;
    }

    return (
        <p id={id} role="alert" className="text-xs leading-4 font-medium text-red-600">
            {message}
        </p>
    );
}
