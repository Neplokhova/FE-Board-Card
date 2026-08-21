import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Card } from "../../../boards/types/board.types";

import "./CardItem.css";

interface CardItemProps {
    card: Card;
    onEdit: () => void;
    onDelete: () => void;
}

function CardItem({ card, onEdit, onDelete }: CardItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <article
            ref={setNodeRef}
            style={style}
            className={`card-item ${isDragging ? "card-item-dragging" : ""}`}
            {...attributes}
            {...listeners}
        >
            <div className="card-item-content">
                <h3 className="card-item-title">{card.name}</h3>

                {card.description && (
                    <p className="card-item-description">{card.description}</p>
                )}
            </div>

            <div
                className="card-item-actions"
                onPointerDown={(event) => {
                    event.stopPropagation();
                }}
            >
                <button
                    type="button"
                    className="card-action-button card-action-edit"
                    onClick={onEdit}
                    aria-label="Edit card"
                    title="Edit card"
                >
                    ✎
                </button>

                <button
                    type="button"
                    className="card-action-button card-action-delete"
                    onClick={onDelete}
                    aria-label="Delete card"
                    title="Delete card"
                >
                    🗑
                </button>
            </div>
        </article>
    );
}

export default CardItem;
