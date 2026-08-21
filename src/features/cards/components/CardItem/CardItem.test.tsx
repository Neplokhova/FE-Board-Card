import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CardItem from "./CardItem";

const { useSortableMock } = vi.hoisted(() => ({
    useSortableMock: vi.fn(),
}));

vi.mock("@dnd-kit/sortable", () => ({
    useSortable: useSortableMock,
}));

vi.mock("@dnd-kit/utilities", () => ({
    CSS: {
        Transform: {
            toString: vi.fn(() => undefined),
        },
    },
}));

const card = {
    id: "card-1",
    name: "Test card",
    description: "Test description",
    status: "todo" as const,
    position: 0,
};

describe("CardItem", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        useSortableMock.mockReturnValue({
            attributes: {
                role: "button",
                tabIndex: 0,
                "aria-disabled": false,
                "aria-pressed": false,
                "aria-roledescription": "sortable",
                "aria-describedby": undefined,
            },
            listeners: {},
            setNodeRef: vi.fn(),
            transform: null,
            transition: undefined,
            isDragging: false,
        });
    });

    it("renders the card title", () => {
        render(
            <CardItem
                card={card}
                onEdit={onEdit}
                onDelete={onDelete}
            />,
        );

        expect(
            screen.getByRole("heading", {
                name: "Test card",
            }),
        ).toBeInTheDocument();
    });

    it("renders the card description", () => {
        render(
            <CardItem
                card={card}
                onEdit={onEdit}
                onDelete={onDelete}
            />,
        );

        expect(
            screen.getByText("Test description"),
        ).toBeInTheDocument();
    });

    it("does not render description when it is empty", () => {
        render(
            <CardItem
                card={{
                    ...card,
                    description: "",
                }}
                onEdit={onEdit}
                onDelete={onDelete}
            />,
        );

        expect(
            screen.queryByText("Test description"),
        ).not.toBeInTheDocument();
    });

    it("calls onEdit when edit button is clicked", async () => {
        const user = userEvent.setup();

        render(
            <CardItem
                card={card}
                onEdit={onEdit}
                onDelete={onDelete}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Edit card",
            }),
        );

        expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it("calls onDelete when delete button is clicked", async () => {
        const user = userEvent.setup();

        render(
            <CardItem
                card={card}
                onEdit={onEdit}
                onDelete={onDelete}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Delete card",
            }),
        );

        expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it("applies dragging styles while dragging", () => {
        useSortableMock.mockReturnValue({
            attributes: {
                role: "button",
                tabIndex: 0,
                "aria-disabled": false,
                "aria-pressed": false,
                "aria-roledescription": "sortable",
                "aria-describedby": undefined,
            },
            listeners: {},
            setNodeRef: vi.fn(),
            transform: null,
            transition: undefined,
            isDragging: true,
        });

        const { container } = render(
            <CardItem
                card={card}
                onEdit={onEdit}
                onDelete={onDelete}
            />,
        );

        expect(
            container.querySelector(".card-item-dragging"),
        ).toBeInTheDocument();
    });

    it("calls the correct callback when action buttons are used", async () => {
        const user = userEvent.setup();

        render(
            <CardItem
                card={card}
                onEdit={onEdit}
                onDelete={onDelete}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Edit card",
            }),
        );

        await user.click(
            screen.getByRole("button", {
                name: "Delete card",
            }),
        );

        expect(onEdit).toHaveBeenCalledTimes(1);
        expect(onDelete).toHaveBeenCalledTimes(1);
    });
});
