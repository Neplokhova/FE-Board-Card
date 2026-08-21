import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BoardPage from "./BoardPage";

const navigateMock = vi.fn();

const createBoardMock = vi.fn();
const updateBoardMock = vi.fn();
const deleteBoardMock = vi.fn();
const createCardMock = vi.fn();
const updateCardMock = vi.fn();
const deleteCardMock = vi.fn();

type BoardQueryState = {
    data:
        | {
        data: {
            id: string;
            name: string;
            cards: {
                todo: {
                    id: string;
                    name: string;
                    description: string;
                    status: "todo";
                    position: number;
                }[];
                "in-progress": {
                    id: string;
                    name: string;
                    description: string;
                    status: "in-progress";
                    position: number;
                }[];
                done: {
                    id: string;
                    name: string;
                    description: string;
                    status: "done";
                    position: number;
                }[];
            };
        };
    }
        | undefined;
    isLoading: boolean;
    isError: boolean;
};

let boardQueryState: BoardQueryState = {
    data: {
        data: {
            id: "board-public-id",
            name: "Test board",
            cards: {
                todo: [
                    {
                        id: "card-1",
                        name: "First card",
                        description: "Description",
                        status: "todo",
                        position: 0,
                    },
                ],
                "in-progress": [],
                done: [],
            },
        },
    },
    isLoading: false,
    isError: false,
};

vi.mock("react-router-dom", () => ({
    useParams: () => ({
        publicId: "board-public-id",
    }),
    useNavigate: () => navigateMock,
}));

vi.mock("../../features/boards/api/boardsApi", () => ({
    useCreateBoardMutation: () => [
        createBoardMock,
        {
            isLoading: false,
        },
    ],

    useGetBoardQuery: () => boardQueryState,

    useUpdateBoardMutation: () => [
        updateBoardMock,
        {
            isLoading: false,
        },
    ],

    useDeleteBoardMutation: () => [
        deleteBoardMock,
        {
            isLoading: false,
        },
    ],

    useCreateCardMutation: () => [
        createCardMock,
        {
            isLoading: false,
        },
    ],

    useUpdateCardMutation: () => [
        updateCardMock,
        {
            isLoading: false,
        },
    ],

    useDeleteCardMutation: () => [
        deleteCardMock,
        {
            isLoading: false,
        },
    ],
}));

vi.mock(
    "../../features/boards/components/BoardLoader/BoardLoader",
    () => ({
        default: ({
                      onCreateBoard,
                  }: {
            onCreateBoard: () => void;
        }) => (
            <button type="button" onClick={onCreateBoard}>
                Create board
            </button>
        ),
    }),
);

vi.mock(
    "../../features/boards/components/BoardHeader/BoardHeader",
    () => ({
        default: ({
                      name,
                      onEdit,
                      onDelete,
                  }: {
            name: string;
            publicId: string;
            onEdit: () => void;
            onDelete: () => void;
        }) => (
            <header>
                <h1>{name}</h1>

                <button type="button" onClick={onEdit}>
                    Edit board
                </button>

                <button type="button" onClick={onDelete}>
                    Delete board
                </button>
            </header>
        ),
    }),
);

vi.mock(
    "../../features/boards/components/BoardColumns/BoardColumns",
    () => ({
        default: ({
                      onAddCard,
                      onEditCard,
                      onDeleteCard,
                  }: {
            cards: unknown;
            publicId: string;
            onAddCard: () => void;
            onEditCard: (card: unknown) => void;
            onDeleteCard: (card: unknown) => void;
        }) => (
            <div>
                <button type="button" onClick={onAddCard}>
                    Add card
                </button>

                <button
                    type="button"
                    onClick={() =>
                        onEditCard({
                            id: "card-1",
                            name: "First card",
                            description: "Description",
                            status: "todo",
                            position: 0,
                        })
                    }
                >
                    Edit card
                </button>

                <button
                    type="button"
                    onClick={() =>
                        onDeleteCard({
                            id: "card-1",
                            name: "First card",
                            description: "Description",
                            status: "todo",
                            position: 0,
                        })
                    }
                >
                    Delete card
                </button>
            </div>
        ),
    }),
);

vi.mock(
    "../../features/boards/components/BoardModal/BoardModal",
    () => ({
        default: ({
                      isOpen,
                      mode,
                      onClose,
                      onSubmit,
                      isSubmitting,
                  }: {
            isOpen: boolean;
            mode: "create" | "edit";
            initialName?: string;
            onClose: () => void;
            onSubmit: (name: string) => void;
            isSubmitting: boolean;
        }) =>
            isOpen ? (
                <div data-testid="board-modal">
                    <span>
                        {mode === "create"
                            ? "Create board modal"
                            : "Edit board modal"}
                    </span>

                    <button
                        type="button"
                        onClick={() => onSubmit("New board")}
                        disabled={isSubmitting}
                    >
                        Submit board
                    </button>

                    <button type="button" onClick={onClose}>
                        Close board modal
                    </button>
                </div>
            ) : null,
    }),
);

vi.mock(
    "../../features/cards/components/CardModal/CardModal",
    () => ({
        default: ({
                      isOpen,
                      mode,
                      onClose,
                      onSubmit,
                      isSubmitting,
                  }: {
            isOpen: boolean;
            mode: "create" | "edit";
            initialTitle?: string;
            initialDescription?: string;
            onClose: () => void;
            onSubmit: (title: string, description: string) => void;
            isSubmitting: boolean;
        }) =>
            isOpen ? (
                <div data-testid="card-modal">
                    <span>
                        {mode === "create"
                            ? "Create card modal"
                            : "Edit card modal"}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            onSubmit("New card", "New description")
                        }
                        disabled={isSubmitting}
                    >
                        Submit card
                    </button>

                    <button type="button" onClick={onClose}>
                        Close card modal
                    </button>
                </div>
            ) : null,
    }),
);

vi.mock(
    "../../components/common/ConfirmationModal/ConfirmationModal",
    () => ({
        default: ({
                      isOpen,
                      title,
                      onClose,
                      onConfirm,
                      isLoading,
                  }: {
            isOpen: boolean;
            title: string;
            message: string;
            onClose: () => void;
            onConfirm: () => void;
            isLoading: boolean;
            confirmText: string;
            error: string;
        }) =>
            isOpen ? (
                <div data-testid="confirmation-modal">
                    <span>{title}</span>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        Confirm
                    </button>

                    <button type="button" onClick={onClose}>
                        Cancel confirmation
                    </button>
                </div>
            ) : null,
    }),
);

describe("BoardPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        boardQueryState = {
            data: {
                data: {
                    id: "board-public-id",
                    name: "Test board",
                    cards: {
                        todo: [
                            {
                                id: "card-1",
                                name: "First card",
                                description: "Description",
                                status: "todo",
                                position: 0,
                            },
                        ],
                        "in-progress": [],
                        done: [],
                    },
                },
            },
            isLoading: false,
            isError: false,
        };

        createBoardMock.mockImplementation(() => ({
            unwrap: () =>
                Promise.resolve({
                    data: {
                        publicId: "new-board-id",
                    },
                }),
        }));

        updateBoardMock.mockImplementation(() => ({
            unwrap: () => Promise.resolve(),
        }));

        deleteBoardMock.mockImplementation(() => ({
            unwrap: () => Promise.resolve(),
        }));

        createCardMock.mockImplementation(() => ({
            unwrap: () => Promise.resolve(),
        }));

        updateCardMock.mockImplementation(() => ({
            unwrap: () => Promise.resolve(),
        }));

        deleteCardMock.mockImplementation(() => ({
            unwrap: () => Promise.resolve(),
        }));
    });

    it("renders the board", () => {
        render(<BoardPage />);

        expect(
            screen.getByRole("heading", {
                name: "Test board",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Add card",
            }),
        ).toBeInTheDocument();
    });

    it("opens the create board modal", async () => {
        const user = userEvent.setup();

        render(<BoardPage />);

        await user.click(
            screen.getByRole("button", {
                name: "Create board",
            }),
        );

        expect(
            screen.getByTestId("board-modal"),
        ).toBeInTheDocument();

        expect(
            screen.getByText("Create board modal"),
        ).toBeInTheDocument();
    });

    it("creates a board and navigates to the new board", async () => {
        const user = userEvent.setup();

        render(<BoardPage />);

        await user.click(
            screen.getByRole("button", {
                name: "Create board",
            }),
        );

        await user.click(
            screen.getByRole("button", {
                name: "Submit board",
            }),
        );

        await vi.waitFor(() => {
            expect(createBoardMock).toHaveBeenCalledWith({
                title: "New board",
            });
        });

        expect(navigateMock).toHaveBeenCalledWith(
            "/board/new-board-id",
        );
    });

    it("opens the edit board modal", async () => {
        const user = userEvent.setup();

        render(<BoardPage />);

        await user.click(
            screen.getByRole("button", {
                name: "Edit board",
            }),
        );

        expect(
            screen.getByText("Edit board modal"),
        ).toBeInTheDocument();
    });

    it("updates the board", async () => {
        const user = userEvent.setup();

        render(<BoardPage />);

        await user.click(
            screen.getByRole("button", {
                name: "Edit board",
            }),
        );

        await user.click(
            screen.getByRole("button", {
                name: "Submit board",
            }),
        );

        await vi.waitFor(() => {
            expect(updateBoardMock).toHaveBeenCalledWith({
                publicId: "board-public-id",
                title: "New board",
            });
        });
    });

    it("opens the board delete confirmation", async () => {
        const user = userEvent.setup();

        render(<BoardPage />);

        await user.click(
            screen.getByRole("button", {
                name: "Delete board",
            }),
        );

        expect(
            screen.getByText("Delete board?"),
        ).toBeInTheDocument();
    });

    it("deletes the board and navigates home", async () => {
        const user = userEvent.setup();

        render(<BoardPage />);

        await user.click(
            screen.getByRole("button", {
                name: "Delete board",
            }),
        );

        await user.click(
            screen.getByRole("button", {
                name: "Confirm",
            }),
        );

        await vi.waitFor(() => {
            expect(deleteBoardMock).toHaveBeenCalledWith(
                "board-public-id",
            );
        });

        expect(navigateMock).toHaveBeenCalledWith("/", {
            replace: true,
        });
    });

    it("opens the create card modal", async () => {
        const user = userEvent.setup();

        render(<BoardPage />);

        await user.click(
            screen.getByRole("button", {
                name: "Add card",
            }),
        );

        expect(
            screen.getByText("Create card modal"),
        ).toBeInTheDocument();
    });

    it("creates a card", async () => {
        const user = userEvent.setup();

        render(<BoardPage />);

        await user.click(
            screen.getByRole("button", {
                name: "Add card",
            }),
        );

        await user.click(
            screen.getByRole("button", {
                name: "Submit card",
            }),
        );

        await vi.waitFor(() => {
            expect(createCardMock).toHaveBeenCalledWith({
                publicId: "board-public-id",
                title: "New card",
                description: "New description",
            });
        });
    });

    it("opens the edit card modal", async () => {
        const user = userEvent.setup();

        render(<BoardPage />);

        await user.click(
            screen.getByRole("button", {
                name: "Edit card",
            }),
        );

        expect(
            screen.getByText("Edit card modal"),
        ).toBeInTheDocument();
    });

    it("updates a card", async () => {
        const user = userEvent.setup();

        render(<BoardPage />);

        await user.click(
            screen.getByRole("button", {
                name: "Edit card",
            }),
        );

        await user.click(
            screen.getByRole("button", {
                name: "Submit card",
            }),
        );

        await vi.waitFor(() => {
            expect(updateCardMock).toHaveBeenCalledWith({
                cardId: "card-1",
                title: "New card",
                description: "New description",
                publicId: "board-public-id",
            });
        });
    });

    it("opens the card delete confirmation", async () => {
        const user = userEvent.setup();

        render(<BoardPage />);

        await user.click(
            screen.getByRole("button", {
                name: "Delete card",
            }),
        );

        expect(
            screen.getByText("Delete card?"),
        ).toBeInTheDocument();
    });

    it("deletes a card", async () => {
        const user = userEvent.setup();

        render(<BoardPage />);

        await user.click(
            screen.getByRole("button", {
                name: "Delete card",
            }),
        );

        await user.click(
            screen.getByRole("button", {
                name: "Confirm",
            }),
        );

        await vi.waitFor(() => {
            expect(deleteCardMock).toHaveBeenCalledWith({
                cardId: "card-1",
                publicId: "board-public-id",
            });
        });
    });

    it("shows loading state while loading the board", () => {
        boardQueryState = {
            data: undefined,
            isLoading: true,
            isError: false,
        };

        render(<BoardPage />);

        expect(
            screen.getByRole("heading", {
                name: "Loading board...",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Please wait while we load your board.",
            ),
        ).toBeInTheDocument();
    });

    it("shows board error state when loading fails", () => {
        boardQueryState = {
            data: undefined,
            isLoading: false,
            isError: true,
        };

        render(<BoardPage />);

        expect(
            screen.getByRole("heading", {
                name: "Unable to load board.",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByText("Please try again."),
        ).toBeInTheDocument();
    });

    it("shows mutation error when creating a board fails", async () => {
        const user = userEvent.setup();

        createBoardMock.mockImplementation(() => ({
            unwrap: () =>
                Promise.reject(new Error("Create failed")),
        }));

        render(<BoardPage />);

        await user.click(
            screen.getByRole("button", {
                name: "Create board",
            }),
        );

        await user.click(
            screen.getByRole("button", {
                name: "Submit board",
            }),
        );

        expect(
            await screen.findByRole("alert"),
        ).toHaveTextContent(
            "Failed to create board. Please try again.",
        );
    });

    it("shows mutation error when creating a card fails", async () => {
        const user = userEvent.setup();

        createCardMock.mockImplementation(() => ({
            unwrap: () =>
                Promise.reject(new Error("Create failed")),
        }));

        render(<BoardPage />);

        await user.click(
            screen.getByRole("button", {
                name: "Add card",
            }),
        );

        await user.click(
            screen.getByRole("button", {
                name: "Submit card",
            }),
        );

        expect(
            await screen.findByRole("alert"),
        ).toHaveTextContent(
            "Failed to create card. Please try again.",
        );
    });
});