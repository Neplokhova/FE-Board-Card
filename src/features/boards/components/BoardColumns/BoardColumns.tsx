import { useEffect, useState, useRef } from "react";

import {
    DndContext,
    type DragEndEvent,
    type DragOverEvent,
    type DragStartEvent,
} from "@dnd-kit/core";

import { arrayMove } from "@dnd-kit/sortable";

import BoardColumn from "../BoardColumn/BoardColumn";
import type { Card, CardsByStatus } from "../../types/board.types";

import { useMoveCardMutation } from "../../api/boardsApi";

import "./BoardColumns.css";

interface BoardColumnsProps {
    cards: CardsByStatus;
    publicId: string;
    onAddCard: () => void;
    onEditCard: (card: Card) => void;
    onDeleteCard: (card: Card) => void;
}

type ColumnKey = keyof CardsByStatus;

const columnKeys: ColumnKey[] = ["todo", "in-progress", "done"];

function getBackendStatus(status: ColumnKey): "To-Do" | "In Progress" | "Done" {
    switch (status) {
        case "todo":
            return "To-Do";

        case "in-progress":
            return "In Progress";

        case "done":
            return "Done";
    }
}

function BoardColumns({
    cards,
    publicId,
    onAddCard,
    onEditCard,
    onDeleteCard,
}: BoardColumnsProps) {
    const [localCards, setLocalCards] = useState<CardsByStatus>(cards);

    const [previousCards, setPreviousCards] = useState<CardsByStatus | null>(
        null,
    );

    const [dragStatus, setDragStatus] = useState<ColumnKey | null>(null);

    const [moveCard, { isLoading: isMovingCard }] = useMoveCardMutation();

    const previousCardsRef = useRef(cards);

    useEffect(() => {
        if (previousCardsRef.current !== cards) {
            previousCardsRef.current = cards;
            setLocalCards(cards);
        }
    }, [cards]);

    const handleDragStart = (event: DragStartEvent) => {
        const activeId = String(event.active.id);

        setPreviousCards(localCards);

        /*
         * Remember the column where the drag started.
         */
        for (const status of columnKeys) {
            if (localCards[status].some((card) => card.id === activeId)) {
                setDragStatus(status);
                break;
            }
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const activeId = String(event.active.id);

        if (!event.over) {
            return;
        }

        const overId = String(event.over.id);

        if (activeId === overId) {
            return;
        }

        setLocalCards((current) => {
            let activeStatus: ColumnKey | null = null;
            let activeCard: Card | null = null;

            let overStatus: ColumnKey | null = null;
            let overCard: Card | null = null;

            for (const status of columnKeys) {
                const foundActive = current[status].find(
                    (card) => card.id === activeId,
                );

                if (foundActive) {
                    activeCard = foundActive;
                    activeStatus = status;
                }

                const foundOver = current[status].find(
                    (card) => card.id === overId,
                );

                if (foundOver) {
                    overCard = foundOver;
                    overStatus = status;
                }
            }

            /*
             * If the pointer is over the column itself,
             * the droppable ID is the column status.
             */
            if (!overStatus && columnKeys.includes(overId as ColumnKey)) {
                overStatus = overId as ColumnKey;
            }

            if (!activeCard || !activeStatus || !overStatus) {
                return current;
            }

            /*
             * Remember the destination column.
             */
            setDragStatus(overStatus);

            /*
             * Same column.
             *
             * We handle the final ordering in dragEnd.
             */
            if (activeStatus === overStatus) {
                return current;
            }

            /*
             * Move the card to another column.
             */
            const next: CardsByStatus = {
                todo: [...current.todo],
                "in-progress": [...current["in-progress"]],
                done: [...current.done],
            };

            next[activeStatus] = next[activeStatus].filter(
                (card) => card.id !== activeId,
            );

            const movedCard: Card = {
                ...activeCard,
                status:
                    overStatus === "todo"
                        ? "todo"
                        : overStatus === "in-progress"
                          ? "in-progress"
                          : "done",
            };

            const destination = next[overStatus];

            const overIndex = overCard
                ? destination.findIndex((card) => card.id === overCard.id)
                : destination.length;

            destination.splice(
                overIndex >= 0 ? overIndex : destination.length,
                0,
                movedCard,
            );

            return next;
        });
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const activeId = String(event.active.id);

        if (!event.over) {
            setDragStatus(null);
            setPreviousCards(null);
            return;
        }

        const overId = String(event.over.id);

        /*
         * We already know the final destination column
         * from dragOver.
         */
        const finalStatus = dragStatus;

        if (!finalStatus) {
            setPreviousCards(null);
            return;
        }

        let finalPosition = -1;

        setLocalCards((current) => {
            const column = current[finalStatus];

            /*
             * Same-column reorder.
             */
            const activeIndex = column.findIndex(
                (card) => card.id === activeId,
            );

            const overIndex = column.findIndex((card) => card.id === overId);

            if (
                activeIndex !== -1 &&
                overIndex !== -1 &&
                activeIndex !== overIndex
            ) {
                const reordered = arrayMove(column, activeIndex, overIndex);

                finalPosition = overIndex;

                return {
                    ...current,
                    [finalStatus]: reordered,
                };
            }

            /*
             * Cross-column move.
             *
             * dragOver already inserted the card into
             * the destination column.
             */
            if (activeIndex !== -1) {
                finalPosition = activeIndex;
            }

            return current;
        });

        /*
         * If the card was dropped directly onto a column,
         * the position is its current index.
         */
        if (finalPosition === -1) {
            const column = localCards[finalStatus];

            const index = column.findIndex((card) => card.id === activeId);

            finalPosition = index;
        }

        if (finalPosition < 0) {
            setDragStatus(null);
            setPreviousCards(null);
            return;
        }

        try {
            await moveCard({
                cardId: activeId,
                publicId,
                status: getBackendStatus(finalStatus),
                position: finalPosition,
            }).unwrap();
        } catch (error) {
            console.error("Failed to move card:", error);

            if (previousCards) {
                setLocalCards(previousCards);
            }
        } finally {
            setDragStatus(null);
            setPreviousCards(null);
        }
    };

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div
                className={`board-columns ${
                    isMovingCard ? "board-columns-moving" : ""
                }`}
            >
                <BoardColumn
                    title="To Do"
                    status="todo"
                    cards={localCards.todo}
                    onAddCard={onAddCard}
                    onEditCard={onEditCard}
                    onDeleteCard={onDeleteCard}
                />

                <BoardColumn
                    title="In Progress"
                    status="in-progress"
                    cards={localCards["in-progress"]}
                    onEditCard={onEditCard}
                    onDeleteCard={onDeleteCard}
                />

                <BoardColumn
                    title="Done"
                    status="done"
                    cards={localCards.done}
                    onEditCard={onEditCard}
                    onDeleteCard={onDeleteCard}
                />
            </div>
        </DndContext>
    );
}

export default BoardColumns;
