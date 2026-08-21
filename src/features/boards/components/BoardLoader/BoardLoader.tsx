import { useState } from "react";
import "./BoardLoader.css";

interface BoardLoaderProps {
    onCreateBoard: () => void;
}

function BoardLoader({ onCreateBoard }: BoardLoaderProps) {
    const [boardId, setBoardId] = useState("");

    const handleLoad = () => {
        const trimmedId = boardId.trim();

        if (!trimmedId) {
            return;
        }

        window.location.href = `/board/${trimmedId}`;
    };

    return (
        <section className="board-loader">
            <div className="board-loader-content">
                <div className="board-loader-text">
                    <h2>Open a board</h2>

                    <p>
                        Enter your board ID to continue working on an existing
                        board.
                    </p>
                </div>

                <div className="board-loader-form">
                    <label htmlFor="board-id">Board ID</label>

                    <div className="board-loader-input-row">
                        <input
                            id="board-id"
                            type="text"
                            placeholder="Enter board ID"
                            value={boardId}
                            onChange={(event) => setBoardId(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleLoad();
                                }
                            }}
                        />

                        <button
                            type="button"
                            onClick={handleLoad}
                            disabled={!boardId.trim()}
                        >
                            Load
                        </button>
                    </div>

                    <button
                        className="board-loader-create"
                        type="button"
                        onClick={onCreateBoard}
                    >
                        + Create new board
                    </button>
                </div>
            </div>
        </section>
    );
}

export default BoardLoader;
