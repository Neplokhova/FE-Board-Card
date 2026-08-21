import { useState } from "react";

import "../../../../components/common/Modal.css";

type CardModalMode = "create" | "edit";

interface CardModalProps {
    isOpen: boolean;
    mode: CardModalMode;
    initialTitle?: string;
    initialDescription?: string;
    onClose: () => void;
    onSubmit: (title: string, description: string) => void;
    isSubmitting: boolean;
}

function CardModal({
    isOpen,
    mode,
    initialTitle,
    initialDescription,
    onClose,
    onSubmit,
    isSubmitting,
}: CardModalProps) {
    const [title, setTitle] = useState(initialTitle ?? "");

    const [description, setDescription] = useState(initialDescription ?? "");

    const [titleError, setTitleError] = useState("");

    const [descriptionError, setDescriptionError] = useState("");

    if (!isOpen) {
        return null;
    }

    const isCreateMode = mode === "create";

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();

        setTitleError("");
        setDescriptionError("");

        if (!trimmedTitle) {
            setTitleError("Card title is required.");
            return;
        }

        if (trimmedTitle.length > 100) {
            setTitleError("Card title must be 100 characters or less.");
            return;
        }

        if (trimmedDescription.length > 300) {
            setDescriptionError("Description must be 300 characters or less.");
            return;
        }

        onSubmit(trimmedTitle, trimmedDescription);
    };

    return (
        <div className="modal-overlay">
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="card-modal-title"
            >
                <h2 id="card-modal-title" className="modal-title">
                    {isCreateMode ? "Create new card" : "Edit card"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="card-title">Title</label>

                    <input
                        id="card-title"
                        type="text"
                        value={title}
                        onChange={(event) => {
                            setTitle(event.target.value);
                            setTitleError("");
                        }}
                        maxLength={100}
                        disabled={isSubmitting}
                    />

                    {titleError && <p className="modal-error">{titleError}</p>}

                    <label htmlFor="card-description">Description</label>

                    <textarea
                        id="card-description"
                        value={description}
                        onChange={(event) => {
                            setDescription(event.target.value);
                            setDescriptionError("");
                        }}
                        maxLength={300}
                        disabled={isSubmitting}
                        rows={4}
                    />

                    {descriptionError && (
                        <p className="modal-error">{descriptionError}</p>
                    )}

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

export default CardModal;
