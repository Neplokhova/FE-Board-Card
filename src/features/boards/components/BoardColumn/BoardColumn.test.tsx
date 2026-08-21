import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BoardColumn from "./BoardColumn";

vi.mock("@dnd-kit/core", () => ({
    useDroppable: vi.fn(() => ({
        setNodeRef: vi.fn(),
        isOver: false,
    })),
}));

vi.mock("@dnd-kit/sortable", () => ({
    SortableContext: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    verticalListSortingStrategy: {},
}));

vi.mock("../../../cards/components/CardItem/CardItem", () => ({
    default: ({
                  card,
                  onEdit,
                  onDelete,
              }: {
        card: { name: string };
        onEdit: () => void;
        onDelete: () => void;
    }) => (
        <div>
            <span>{card.name}</span>
            <button type="button" onClick={onEdit}>
                Edit card
            </button>
            <button type="button" onClick={onDelete}>
                Delete card
            </button>
        </div>
    ),
}));

const cards = [
    {
        id: "card-1",
        name: "First card",
        description: "First description",
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
];

describe("BoardColumn", () => {
    it("renders the column title", () => {
        render(
            <BoardColumn
                title="To Do"
                status="todo"
                cards={cards}
                onEditCard={vi.fn()}
                onDeleteCard={vi.fn()}
            />,
        );

        expect(
            screen.getByRole("heading", {
                name: "To Do",
            }),
        ).toBeInTheDocument();
    });

    it("renders all cards", () => {
        render(
            <BoardColumn
                title="To Do"
                status="todo"
                cards={cards}
                onEditCard={vi.fn()}
                onDeleteCard={vi.fn()}
            />,
        );

        expect(
            screen.getByText("First card"),
        ).toBeInTheDocument();

        expect(
            screen.getByText("Second card"),
        ).toBeInTheDocument();
    });

    it("renders empty state when there are no cards", () => {
        render(
            <BoardColumn
                title="To Do"
                status="todo"
                cards={[]}
                onEditCard={vi.fn()}
                onDeleteCard={vi.fn()}
            />,
        );

        expect(
            screen.getByText("No cards yet."),
        ).toBeInTheDocument();
    });

    it("renders Add card button when onAddCard is provided", () => {
        render(
            <BoardColumn
                title="To Do"
                status="todo"
                cards={[]}
                onAddCard={vi.fn()}
                onEditCard={vi.fn()}
                onDeleteCard={vi.fn()}
            />,
        );

        expect(
            screen.getByRole("button", {
                name: "+ Add card",
            }),
        ).toBeInTheDocument();
    });

    it("does not render Add card button when onAddCard is not provided", () => {
        render(
            <BoardColumn
                title="In Progress"
                status="in-progress"
                cards={cards}
                onEditCard={vi.fn()}
                onDeleteCard={vi.fn()}
            />,
        );

        expect(
            screen.queryByRole("button", {
                name: "+ Add card",
            }),
        ).not.toBeInTheDocument();
    });

    it("calls onAddCard when Add card is clicked", async () => {
        const user = userEvent.setup();
        const onAddCard = vi.fn();

        render(
            <BoardColumn
                title="To Do"
                status="todo"
                cards={[]}
                onAddCard={onAddCard}
                onEditCard={vi.fn()}
                onDeleteCard={vi.fn()}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "+ Add card",
            }),
        );

        expect(onAddCard).toHaveBeenCalledTimes(1);
    });

    it("calls edit and delete callbacks with the correct card", async () => {
        const user = userEvent.setup();
        const onEditCard = vi.fn();
        const onDeleteCard = vi.fn();

        render(
            <BoardColumn
                title="To Do"
                status="todo"
                cards={cards}
                onEditCard={onEditCard}
                onDeleteCard={onDeleteCard}
            />,
        );

        const editButtons = screen.getAllByRole("button", {
            name: "Edit card",
        });

        const deleteButtons = screen.getAllByRole("button", {
            name: "Delete card",
        });

        await user.click(editButtons[0]);
        await user.click(deleteButtons[1]);

        expect(onEditCard).toHaveBeenCalledWith(cards[0]);
        expect(onDeleteCard).toHaveBeenCalledWith(cards[1]);
    });
});