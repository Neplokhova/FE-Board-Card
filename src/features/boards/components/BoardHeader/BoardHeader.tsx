import { useState } from "react";

import "./BoardHeader.css";

interface BoardHeaderProps {
    name: string;
    publicId: string;
    onEdit: () => void;
    onDelete: () => void;
}

function BoardHeader({ name, publicId, onEdit, onDelete }: BoardHeaderProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(publicId);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy board ID:", error);
        }
    };

    return (
        <header className="board-header">
            <div className="board-header-main">
                <div className="board-header-title-section">
                    <span className="board-header-label">Kanban Board</span>

                    <h2 className="board-header-title">{name}</h2>
                </div>

                <div className="board-header-actions">
                    <button
                        type="button"
                        className="board-action-button board-action-edit"
                        onClick={onEdit}
                        aria-label="Edit board"
                        title="Edit board"
                    >
                        ✎
                    </button>

                    <button
                        type="button"
                        className="board-action-button board-action-delete"
                        onClick={onDelete}
                        aria-label="Delete board"
                        title="Delete board"
                    >
                        🗑
                    </button>
                </div>
            </div>

            <div className="board-header-bottom">
                <div className="board-id-info">
                    <span className="board-id-label">Board ID</span>

                    <span className="board-id">{publicId}</span>
                </div>

                <button
                    type="button"
                    className="copy-button"
                    onClick={handleCopy}
                >
                    {copied ? "Copied!" : "Copy ID"}
                </button>
            </div>
        </header>
    );
}

export default BoardHeader;
