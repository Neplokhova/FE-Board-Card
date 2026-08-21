import { api } from "../../../app/store/api";
import type {
    BoardResponse,
    CreateBoardRequest,
    CreateBoardResponse,
    CreateCardResponse,
} from "../types/board.types";

export const boardsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getBoard: builder.query<BoardResponse, string>({
            query: (publicId) => `/board/${publicId}`,
            providesTags: (_result, _error, publicId) => [
                { type: "Board", id: publicId },
            ],
        }),

        createBoard: builder.mutation<CreateBoardResponse, CreateBoardRequest>({
            query: (body) => ({
                url: "/board",
                method: "POST",
                body,
            }),
        }),

        updateBoard: builder.mutation<
            BoardResponse,
            { publicId: string; title: string }
        >({
            query: ({ publicId, title }) => ({
                url: `/board/${publicId}`,
                method: "PATCH",
                body: {
                    title,
                },
            }),
            invalidatesTags: (_result, _error, { publicId }) => [
                { type: "Board", id: publicId },
            ],
        }),

        deleteBoard: builder.mutation<void, string>({
            query: (publicId) => ({
                url: `/board/${publicId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, publicId) => [
                { type: "Board", id: publicId },
            ],
        }),

        createCard: builder.mutation<
            CreateCardResponse,
            {
                publicId: string;
                title: string;
                description?: string;
            }
        >({
            query: ({ publicId, title, description }) => ({
                url: `/board/${publicId}/cards`,
                method: "POST",
                body: {
                    title,
                    description,
                },
            }),
            invalidatesTags: (_result, _error, { publicId }) => [
                { type: "Board", id: publicId },
            ],
        }),

        updateCard: builder.mutation<
            CreateCardResponse,
            {
                cardId: string;
                title: string;
                description: string;
                publicId: string;
            }
        >({
            query: ({ cardId, title, description }) => ({
                url: `/card/${cardId}`,
                method: "PATCH",
                body: {
                    title,
                    description,
                },
            }),
            invalidatesTags: (_result, _error, { publicId }) => [
                { type: "Board", id: publicId },
            ],
        }),

        deleteCard: builder.mutation<
            void,
            {
                cardId: string;
                publicId: string;
            }
        >({
            query: ({ cardId }) => ({
                url: `/card/${cardId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, { publicId }) => [
                { type: "Board", id: publicId },
            ],
        }),

        moveCard: builder.mutation<
            CreateCardResponse,
            {
                cardId: string;
                publicId: string;
                status: "To-Do" | "In Progress" | "Done";
                position: number;
            }
        >({
            query: ({ cardId, status, position }) => ({
                url: `/card/${cardId}/move`,
                method: "PATCH",
                body: {
                    status,
                    position,
                },
            }),
            invalidatesTags: (_result, _error, { publicId }) => [
                {
                    type: "Board",
                    id: publicId,
                },
            ],
        }),
    }),
});

export const {
    useGetBoardQuery,
    useCreateBoardMutation,
    useUpdateBoardMutation,
    useDeleteBoardMutation,
    useCreateCardMutation,
    useUpdateCardMutation,
    useDeleteCardMutation,
    useMoveCardMutation,
} = boardsApi;
