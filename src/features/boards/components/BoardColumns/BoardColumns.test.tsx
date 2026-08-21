import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BoardColumns from "./BoardColumns";

const moveCardMock = vi.fn();

let dndHandlers: {
    onDragStart?: (event: unknown) => void;
    onDragOver?: (event: unknown) => void;
    onDragEnd?: (event: unknown) => void;
} = {};

vi.mock("../../api/boardsApi", () => ({
    useMoveCardMutation: () => [
        moveCardMock,
        {
            isLoading: false,
        },
    ],
}));

vi.mock("@dnd-kit/core", () => ({
    DndContext: ({
        children,
        onDragStart,
        onDragOver,
        onDragEnd,
    }: {
        children: React.ReactNode;
        onDragStart: (event: unknown) => void;
        onDragOver: (event: unknown) => void;
        onDragEnd: (event: unknown) => void;
    }) => {
        dndHandlers = {
            onDragStart,
            onDragOver,
            onDragEnd,
        };

        return <div>{children}</div>;
    },
}));

vi.mock("@dnd-kit/sortable", () => ({
    arrayMove: (array: unknown[], oldIndex: number, newIndex: number) => {
        const result = [...array];

        const [item] = result.splice(oldIndex, 1);

        result.splice(newIndex, 0, item);

        return result;
    },
}));

vi.mock("../BoardColumn/BoardColumn", () => ({
    default: ({
        title,
        cards,
        onAddCard,
        onEditCard,
        onDeleteCard,
    }: {
        title: string;
        cards: {
            id: string;
            name: string;
        }[];
        onAddCard?: () => void;
        onEditCard: (card: { id: string; name: string }) => void;
        onDeleteCard: (card: { id: string; name: string }) => void;
    }) => (
        <section>
            <h2>{title}</h2>

            {cards.map((card) => (
                <div key={card.id}>
                    <span>{card.name}</span>

                    <button type="button" onClick={() => onEditCard(card)}>
                        Edit {card.name}
                    </button>

                    <button type="button" onClick={() => onDeleteCard(card)}>
                        Delete {card.name}
                    </button>
                </div>
            ))}

            {onAddCard && (
                <button type="button" onClick={onAddCard}>
                    Add card
                </button>
            )}
        </section>
    ),
}));

const cards = {
    todo: [
        {
            id: "card-1",
            name: "First card",
            description: "",
            status: "todo" as const,
            position: 0,
        },
        {
            id: "card-2",
            name: "Second card",
            description: "",
            status: "todo" as const,
            position: 1,
        },
    ],

    "in-progress": [
        {
            id: "card-3",
            name: "In progress card",
            description: "",
            status: "in-progress" as const,
            position: 0,
        },
    ],

    done: [
        {
            id: "card-4",
            name: "Done card",
            description: "",
            status: "done" as const,
            position: 0,
        },
    ],
};

describe("BoardColumns", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        dndHandlers = {};

        moveCardMock.mockImplementation(() => ({
            unwrap: () => Promise.resolve(),
        }));
    });

    it("renders all three columns", () => {
        render(
            <BoardColumns
                cards={cards}
                publicId="board-1"
                onAddCard={vi.fn()}
                onEditCard={vi.fn()}
                onDeleteCard={vi.fn()}
            />,
        );

        expect(
            screen.getByRole("heading", {
                name: "To Do",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "In Progress",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "Done",
            }),
        ).toBeInTheDocument();
    });

    it("renders cards in their corresponding columns", () => {
        render(
            <BoardColumns
                cards={cards}
                publicId="board-1"
                onAddCard={vi.fn()}
                onEditCard={vi.fn()}
                onDeleteCard={vi.fn()}
            />,
        );

        expect(screen.getByText("First card")).toBeInTheDocument();

        expect(screen.getByText("Second card")).toBeInTheDocument();

        expect(screen.getByText("In progress card")).toBeInTheDocument();

        expect(screen.getByText("Done card")).toBeInTheDocument();
    });

    it("calls onAddCard when Add card is clicked", async () => {
        const user = userEvent.setup();
        const onAddCard = vi.fn();

        render(
            <BoardColumns
                cards={cards}
                publicId="board-1"
                onAddCard={onAddCard}
                onEditCard={vi.fn()}
                onDeleteCard={vi.fn()}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Add card",
            }),
        );

        expect(onAddCard).toHaveBeenCalledTimes(1);
    });

    it("calls edit and delete callbacks with the correct card", async () => {
        const user = userEvent.setup();

        const onEditCard = vi.fn();
        const onDeleteCard = vi.fn();

        render(
            <BoardColumns
                cards={cards}
                publicId="board-1"
                onAddCard={vi.fn()}
                onEditCard={onEditCard}
                onDeleteCard={onDeleteCard}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Edit First card",
            }),
        );

        await user.click(
            screen.getByRole("button", {
                name: "Delete Second card",
            }),
        );

        expect(onEditCard).toHaveBeenCalledWith(cards.todo[0]);

        expect(onDeleteCard).toHaveBeenCalledWith(cards.todo[1]);
    });

    it("moves a card within the same column", async () => {
        render(
            <BoardColumns
                cards={cards}
                publicId="board-1"
                onAddCard={vi.fn()}
                onEditCard={vi.fn()}
                onDeleteCard={vi.fn()}
            />,
        );

        await act(async () => {
            dndHandlers.onDragStart?.({
                active: {
                    id: "card-1",
                },
            });
        });

        await act(async () => {
            dndHandlers.onDragOver?.({
                active: {
                    id: "card-1",
                },
                over: {
                    id: "card-2",
                },
            });
        });

        await act(async () => {
            dndHandlers.onDragEnd?.({
                active: {
                    id: "card-1",
                },
                over: {
                    id: "card-2",
                },
            });
        });

        await vi.waitFor(() => {
            expect(moveCardMock).toHaveBeenCalledWith({
                cardId: "card-1",
                publicId: "board-1",
                status: "To-Do",
                position: 1,
            });
        });
    });

    it("moves a card to another column", async () => {
        render(
            <BoardColumns
                cards={cards}
                publicId="board-1"
                onAddCard={vi.fn()}
                onEditCard={vi.fn()}
                onDeleteCard={vi.fn()}
            />,
        );

        await act(async () => {
            dndHandlers.onDragStart?.({
                active: {
                    id: "card-1",
                },
            });
        });

        await act(async () => {
            dndHandlers.onDragOver?.({
                active: {
                    id: "card-1",
                },
                over: {
                    id: "in-progress",
                },
            });
        });

        await act(async () => {
            dndHandlers.onDragEnd?.({
                active: {
                    id: "card-1",
                },
                over: {
                    id: "in-progress",
                },
            });
        });

        await vi.waitFor(() => {
            expect(moveCardMock).toHaveBeenCalledWith({
                cardId: "card-1",
                publicId: "board-1",
                status: "In Progress",
                position: 1,
            });
        });
    });

    it("does not move a card when there is no drop target", async () => {
        render(
            <BoardColumns
                cards={cards}
                publicId="board-1"
                onAddCard={vi.fn()}
                onEditCard={vi.fn()}
                onDeleteCard={vi.fn()}
            />,
        );

        await act(async () => {
            dndHandlers.onDragStart?.({
                active: {
                    id: "card-1",
                },
            });

            dndHandlers.onDragEnd?.({
                active: {
                    id: "card-1",
                },
                over: null,
            });
        });

        expect(moveCardMock).not.toHaveBeenCalled();
    });
});
