import { useState } from "react";

import "./BoardModal.css";
import "../../../../components/common/Modal.css";

type BoardModalMode = "create" | "edit";

interface BoardModalProps {
    isOpen: boolean;
    mode: BoardModalMode;
    initialName?: string;
    onClose: () => void;
    onSubmit: (name: string) => void;
    isSubmitting: boolean;
}

function BoardModal({
    isOpen,
    mode,
    initialName,
    onClose,
    onSubmit,
    isSubmitting,
}: BoardModalProps) {
    const [name, setName] = useState(initialName ?? "");
    const [error, setError] = useState("");

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            setError("Board name is required.");
            return;
        }

        if (trimmedName.length > 100) {
            setError("Board name must be 100 characters or less.");
            return;
        }

        setError("");
        onSubmit(trimmedName);
    };

    const isCreateMode = mode === "create";

    return (
        <div className="modal-overlay">
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="board-modal-title"
            >
                <h2 id="board-modal-title" className="modal-title">
                    {isCreateMode ? "Create new board" : "Edit board"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="board-name">Board name</label>

                    <input
                        id="board-name"
                        type="text"
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                            setError("");
                        }}
                        maxLength={100}
                        disabled={isSubmitting}
                    />

                    {error && <p className="modal-error">{error}</p>}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="modal-button modal-button-secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="modal-button modal-button-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? isCreateMode
                                    ? "Creating..."
                                    : "Saving..."
                                : isCreateMode
                                  ? "Create"
                                  : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BoardModal;
