import { useDroppable } from "@dnd-kit/core";

import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import CardItem from "../../../cards/components/CardItem/CardItem";

import type { Card, CardStatus } from "../../types/board.types";

import "./BoardColumn.css";

interface BoardColumnProps {
    title: string;
    status: CardStatus;
    cards: Card[];
    onAddCard?: () => void;
    onEditCard: (card: Card) => void;
    onDeleteCard: (card: Card) => void;
}

function BoardColumn({
    title,
    status,
    cards,
    onAddCard,
    onEditCard,
    onDeleteCard,
}: BoardColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: status,
    });

    return (
        <section
            ref={setNodeRef}
            className={`board-column ${isOver ? "board-column-drag-over" : ""}`}
        >
            <header className="board-column-header">
                <h2>{title}</h2>
            </header>

            <div className="board-column-cards">
                <SortableContext
                    items={cards.map((card) => card.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {cards.length === 0 ? (
                        <div className="board-column-empty">
                            <p>No cards yet.</p>
                        </div>
                    ) : (
                        cards.map((card) => (
                            <CardItem
                                key={card.id}
                                card={card}
                                onEdit={() => onEditCard(card)}
                                onDelete={() => onDeleteCard(card)}
                            />
                        ))
                    )}
                </SortableContext>
            </div>

            {onAddCard && (
                <button
                    type="button"
                    className="board-column-add-card"
                    onClick={onAddCard}
                >
                    + Add card
                </button>
            )}
        </section>
    );
}

export default BoardColumn;
