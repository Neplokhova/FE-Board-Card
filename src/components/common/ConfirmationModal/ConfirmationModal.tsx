import "./ConfirmationModal.css";
import "../Modal.css";

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    confirmText?: string;
    error?: string;
}

function ConfirmationModal({
    isOpen,
    title,
    message,
    onClose,
    onConfirm,
    isLoading,
    confirmText = "Confirm",
    error,
}: ConfirmationModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal" role="dialog" aria-modal="true">
                <h2 className="modal-title">{title}</h2>

                <p className="modal-message">{message}</p>

                {error && <p className="modal-error">{error}</p>}

                <div className="modal-actions">
                    <button
                        type="button"
                        className="modal-button modal-button-secondary"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="modal-button modal-button-danger"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Deleting..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
