import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BoardModal from "./BoardModal";

describe("BoardModal", () => {
    it("renders create mode", () => {
        render(
            <BoardModal
                isOpen={true}
                mode="create"
                onClose={vi.fn()}
                onSubmit={vi.fn()}
                isSubmitting={false}
            />,
        );

        expect(
            screen.getByRole("heading", {
                name: "Create new board",
            }),
        ).toBeInTheDocument();

        expect(screen.getByLabelText("Board name")).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Create",
            }),
        ).toBeInTheDocument();
    });

    it("does not render when closed", () => {
        render(
            <BoardModal
                isOpen={false}
                mode="create"
                onClose={vi.fn()}
                onSubmit={vi.fn()}
                isSubmitting={false}
            />,
        );

        expect(
            screen.queryByRole("heading", {
                name: "Create new board",
            }),
        ).not.toBeInTheDocument();
    });

    it("shows validation error when name is empty", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <BoardModal
                isOpen={true}
                mode="create"
                onClose={vi.fn()}
                onSubmit={onSubmit}
                isSubmitting={false}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Create",
            }),
        );

        expect(screen.getByText("Board name is required.")).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("submits the trimmed board name", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <BoardModal
                isOpen={true}
                mode="create"
                onClose={vi.fn()}
                onSubmit={onSubmit}
                isSubmitting={false}
            />,
        );

        const input = screen.getByLabelText("Board name");

        await user.type(input, "   My board   ");

        await user.click(
            screen.getByRole("button", {
                name: "Create",
            }),
        );

        expect(onSubmit).toHaveBeenCalledWith("My board");
    });

    it("calls onClose when Cancel is clicked", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(
            <BoardModal
                isOpen={true}
                mode="create"
                onClose={onClose}
                onSubmit={vi.fn()}
                isSubmitting={false}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Cancel",
            }),
        );

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("shows Creating while submitting", () => {
        render(
            <BoardModal
                isOpen={true}
                mode="create"
                onClose={vi.fn()}
                onSubmit={vi.fn()}
                isSubmitting={true}
            />,
        );

        expect(
            screen.getByRole("button", {
                name: "Creating...",
            }),
        ).toBeDisabled();
    });
});
