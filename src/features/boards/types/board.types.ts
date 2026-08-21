export type CardStatus = "todo" | "in-progress" | "done";

export interface Card {
    id: string;
    name: string;
    description: string;
    status: CardStatus;
    position: number;
}

export interface CardsByStatus {
    todo: Card[];
    "in-progress": Card[];
    done: Card[];
}

export interface Board {
    id: string;
    name: string;
    cards: CardsByStatus;
}

export interface BoardResponse {
    success: boolean;
    data: Board;
    message: string;
}

export interface CreateBoardRequest {
    title: string;
}

export interface CreatedBoard {
    title: string;
    _id: string;
    publicId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBoardResponse {
    success: boolean;
    data: CreatedBoard;
    message: string;
}

export interface CreateCardRequest {
    publicId: string;
    title: string;
    description?: string;
}

export interface CreateCardResponse {
    success: boolean;
    data: Card;
    message: string;
}
