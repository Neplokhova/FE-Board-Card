import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CardModal from "./CardModal";

describe("CardModal", () => {
    it("renders create mode", () => {
        render(
            <CardModal
                isOpen={true}
                mode="create"
                onClose={vi.fn()}
                onSubmit={vi.fn()}
                isSubmitting={false}
            />,
        );

        expect(
            screen.getByRole("heading", {
                name: "Create new card",
            }),
        ).toBeInTheDocument();

        expect(screen.getByLabelText("Title")).toBeInTheDocument();

        expect(screen.getByLabelText("Description")).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Create",
            }),
        ).toBeInTheDocument();
    });

    it("renders edit mode with initial values", () => {
        render(
            <CardModal
                isOpen={true}
                mode="edit"
                initialTitle="Existing card"
                initialDescription="Existing description"
                onClose={vi.fn()}
                onSubmit={vi.fn()}
                isSubmitting={false}
            />,
        );

        expect(
            screen.getByRole("heading", {
                name: "Edit card",
            }),
        ).toBeInTheDocument();

        expect(screen.getByLabelText("Title")).toHaveValue("Existing card");

        expect(screen.getByLabelText("Description")).toHaveValue(
            "Existing description",
        );

        expect(
            screen.getByRole("button", {
                name: "Save",
            }),
        ).toBeInTheDocument();
    });

    it("does not render when closed", () => {
        render(
            <CardModal
                isOpen={false}
                mode="create"
                onClose={vi.fn()}
                onSubmit={vi.fn()}
                isSubmitting={false}
            />,
        );

        expect(
            screen.queryByRole("heading", {
                name: "Create new card",
            }),
        ).not.toBeInTheDocument();
    });

    it("shows validation error when title is empty", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <CardModal
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

        expect(screen.getByText("Card title is required.")).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("submits trimmed title and description", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <CardModal
                isOpen={true}
                mode="create"
                onClose={vi.fn()}
                onSubmit={onSubmit}
                isSubmitting={false}
            />,
        );

        await user.type(screen.getByLabelText("Title"), "   My card   ");

        await user.type(
            screen.getByLabelText("Description"),
            "   Card description   ",
        );

        await user.click(
            screen.getByRole("button", {
                name: "Create",
            }),
        );

        expect(onSubmit).toHaveBeenCalledWith("My card", "Card description");
    });

    it("accepts a description with exactly 300 characters", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <CardModal
                isOpen={true}
                mode="create"
                onClose={vi.fn()}
                onSubmit={onSubmit}
                isSubmitting={false}
            />,
        );

        await user.type(screen.getByLabelText("Title"), "Card");

        const description = "a".repeat(300);

        await user.type(screen.getByLabelText("Description"), description);

        await user.click(
            screen.getByRole("button", {
                name: "Create",
            }),
        );

        expect(onSubmit).toHaveBeenCalledWith("Card", description);
    });

    it("calls onClose when Cancel is clicked", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(
            <CardModal
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

    it("shows loading state while submitting", () => {
        render(
            <CardModal
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

        expect(screen.getByLabelText("Title")).toBeDisabled();

        expect(screen.getByLabelText("Description")).toBeDisabled();
    });
});
