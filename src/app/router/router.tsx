import { createBrowserRouter } from "react-router-dom";

import BoardPage from "../../pages/BoardPage/BoardPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <BoardPage />,
    },
    {
        path: "/board/:publicId",
        element: <BoardPage />,
    },
]);
