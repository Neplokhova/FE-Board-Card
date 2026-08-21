import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./BoardPage.css";

import BoardLoader from "../../features/boards/components/BoardLoader/BoardLoader";
import BoardHeader from "../../features/boards/components/BoardHeader/BoardHeader";
import BoardModal from "../../features/boards/components/BoardModal/BoardModal";
import BoardColumns from "../../features/boards/components/BoardColumns/BoardColumns";
import ConfirmationModal from "../../components/common/ConfirmationModal/ConfirmationModal";
import CardModal from "../../features/cards/components/CardModal/CardModal";

import type { Card } from "../../features/boards/types/board.types";

import {
    useCreateBoardMutation,
    useGetBoardQuery,
    useUpdateBoardMutation,
    useDeleteBoardMutation,
    useCreateCardMutation,
    useUpdateCardMutation,
    useDeleteCardMutation,
} from "../../features/boards/api/boardsApi";

function BoardPage() {
    const { publicId } = useParams<{ publicId: string }>();

    const navigate = useNavigate();

    const [deleteError, setDeleteError] = useState("");

    const [cardDeleteError, setCardDeleteError] = useState("");

    const [mutationError, setMutationError] = useState("");

    const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [boardModalMode, setBoardModalMode] = useState<"create" | "edit">(
        "create",
    );

    const [isCardModalOpen, setIsCardModalOpen] = useState(false);

    const [cardModalMode, setCardModalMode] = useState<"create" | "edit">(
        "create",
    );

    const [selectedCard, setSelectedCard] = useState<Card | null>(null);

    const [isCardDeleteModalOpen, setIsCardDeleteModalOpen] = useState(false);

    const [createBoard, { isLoading: isCreating }] = useCreateBoardMutation();

    const [updateBoard, { isLoading: isUpdating }] = useUpdateBoardMutation();

    const [deleteBoard, { isLoading: isDeleting }] = useDeleteBoardMutation();

    const { data, isLoading, isError } = useGetBoardQuery(publicId!, {
        skip: !publicId,
    });

    const [createCard, { isLoading: isCreatingCard }] = useCreateCardMutation();

    const [updateCard, { isLoading: isUpdatingCard }] = useUpdateCardMutation();

    const [deleteCard, { isLoading: isDeletingCard }] = useDeleteCardMutation();

    const handleCreateBoard = async (name: string) => {
        setMutationError("");

        try {
            const response = await createBoard({
                title: name,
            }).unwrap();

            const newPublicId = response.data.publicId;

            setIsBoardModalOpen(false);

            navigate(`/board/${newPublicId}`);
        } catch (error) {
            console.error("Failed to create board:", error);

            setMutationError("Failed to create board. Please try again.");
        }
    };

    const handleEditBoard = () => {
        setMutationError("");

        setBoardModalMode("edit");
        setIsBoardModalOpen(true);
    };

    const handleBoardSubmit = async (name: string) => {
        if (boardModalMode === "create") {
            await handleCreateBoard(name);
            return;
        }

        if (boardModalMode === "edit" && publicId) {
            setMutationError("");

            try {
                await updateBoard({
                    publicId,
                    title: name,
                }).unwrap();

                setIsBoardModalOpen(false);
            } catch (error) {
                console.error("Failed to update board:", error);

                setMutationError("Failed to update board. Please try again.");
            }
        }
    };

    const handleDeleteBoard = () => {
        setDeleteError("");
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setDeleteError("");
        setIsDeleteModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (!publicId) {
            return;
        }

        setDeleteError("");

        try {
            await deleteBoard(publicId).unwrap();

            setIsDeleteModalOpen(false);

            navigate("/", {
                replace: true,
            });
        } catch (error) {
            console.error("Failed to delete board:", error);

            setDeleteError("Could not delete the board. Please try again.");
        }
    };

    const handleAddCard = () => {
        setMutationError("");

        setCardModalMode("create");
        setSelectedCard(null);
        setIsCardModalOpen(true);
    };

    const handleEditCard = (card: Card) => {
        setMutationError("");

        setSelectedCard(card);
        setCardModalMode("edit");
        setIsCardModalOpen(true);
    };

    const handleCreateCard = async (title: string, description: string) => {
        if (!publicId) {
            return;
        }

        setMutationError("");

        try {
            await createCard({
                publicId,
                title,
                description,
            }).unwrap();

            setIsCardModalOpen(false);
        } catch (error) {
            console.error("Failed to create card:", error);

            setMutationError("Failed to create card. Please try again.");
        }
    };

    const handleUpdateCard = async (title: string, description: string) => {
        if (!publicId || !selectedCard) {
            return;
        }

        setMutationError("");

        try {
            await updateCard({
                cardId: selectedCard.id,
                title,
                description,
                publicId,
            }).unwrap();

            setIsCardModalOpen(false);
            setSelectedCard(null);
        } catch (error) {
            console.error("Failed to update card:", error);

            setMutationError("Failed to update card. Please try again.");
        }
    };

    const handleCardSubmit = async (title: string, description: string) => {
        if (cardModalMode === "create") {
            await handleCreateCard(title, description);

            return;
        }

        await handleUpdateCard(title, description);
    };

    const handleDeleteCard = (card: Card) => {
        setCardDeleteError("");

        setSelectedCard(card);
        setIsCardDeleteModalOpen(true);
    };

    const handleCloseCardDeleteModal = () => {
        setCardDeleteError("");

        setIsCardDeleteModalOpen(false);
        setSelectedCard(null);
    };

    const handleConfirmDeleteCard = async () => {
        if (!publicId || !selectedCard) {
            return;
        }

        setCardDeleteError("");

        try {
            await deleteCard({
                cardId: selectedCard.id,
                publicId,
            }).unwrap();

            setIsCardDeleteModalOpen(false);

            setSelectedCard(null);
        } catch (error) {
            console.error("Failed to delete card:", error);

            setCardDeleteError("Could not delete the card. Please try again.");
        }
    };

    if (publicId && isLoading) {
        return (
            <main className="board-page">
                <div className="board-loading">
                    <div className="board-loading-spinner" />

                    <h2>Loading board...</h2>

                    <p>Please wait while we load your board.</p>
                </div>
            </main>
        );
    }

    if (publicId && isError) {
        return (
            <main className="board-page">
                <div className="board-error">
                    <h2>Unable to load board.</h2>

                    <p>Please try again.</p>

                    <BoardLoader
                        onCreateBoard={() => {
                            setBoardModalMode("create");

                            setIsBoardModalOpen(true);
                        }}
                    />

                    <BoardModal
                        isOpen={isBoardModalOpen}
                        mode="create"
                        initialName=""
                        onClose={() => setIsBoardModalOpen(false)}
                        onSubmit={handleCreateBoard}
                        isSubmitting={isCreating}
                    />
                </div>
            </main>
        );
    }

    const board = data?.data;

    return (
        <main className="board-page">
            <div className="board-page-content">
                <BoardLoader
                    onCreateBoard={() => {
                        setMutationError("");

                        setBoardModalMode("create");

                        setIsBoardModalOpen(true);
                    }}
                />

                {mutationError && (
                    <div className="board-mutation-error" role="alert">
                        {mutationError}
                    </div>
                )}

                {publicId && board && (
                    <>
                        <BoardHeader
                            name={board.name}
                            publicId={board.id}
                            onEdit={handleEditBoard}
                            onDelete={handleDeleteBoard}
                        />

                        <BoardColumns
                            cards={board.cards}
                            publicId={publicId}
                            onAddCard={handleAddCard}
                            onEditCard={handleEditCard}
                            onDeleteCard={handleDeleteCard}
                        />
                    </>
                )}

                <BoardModal
                    key={`${boardModalMode}-${board?.id ?? "new"}`}
                    isOpen={isBoardModalOpen}
                    mode={boardModalMode}
                    initialName={boardModalMode === "edit" ? board?.name : ""}
                    onClose={() => setIsBoardModalOpen(false)}
                    onSubmit={handleBoardSubmit}
                    isSubmitting={
                        boardModalMode === "create" ? isCreating : isUpdating
                    }
                />

                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    title="Delete board?"
                    message="This will permanently delete the board and all of its cards."
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleConfirmDelete}
                    isLoading={isDeleting}
                    confirmText="Delete"
                    error={deleteError}
                />

                <ConfirmationModal
                    isOpen={isCardDeleteModalOpen}
                    title="Delete card?"
                    message="This will permanently delete the card."
                    onClose={handleCloseCardDeleteModal}
                    onConfirm={handleConfirmDeleteCard}
                    isLoading={isDeletingCard}
                    confirmText="Delete"
                    error={cardDeleteError}
                />

                <CardModal
                    key={`${cardModalMode}-${selectedCard?.id ?? "new"}`}
                    isOpen={isCardModalOpen}
                    mode={cardModalMode}
                    initialTitle={
                        cardModalMode === "edit" ? selectedCard?.name : ""
                    }
                    initialDescription={
                        cardModalMode === "edit"
                            ? selectedCard?.description
                            : ""
                    }
                    onClose={() => {
                        setIsCardModalOpen(false);
                        setSelectedCard(null);
                        setMutationError("");
                    }}
                    onSubmit={handleCardSubmit}
                    isSubmitting={
                        cardModalMode === "create"
                            ? isCreatingCard
                            : isUpdatingCard
                    }
                />
            </div>
        </main>
    );
}

export default BoardPage;
