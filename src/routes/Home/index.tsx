import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Boards from "routes/Home/Boards";
import Board from "routes/Home/Boards/Board";
import Settings from "routes/Home/Boards/Board/Settings";
import BoardsProvider from "routes/Home/Boards/Provider";
import Error from "routes/Home/Error";
import Credentials from "./Boards/Board/Credentials";
import CreditCards from "./Boards/Board/CreditCards";
import Documents from "./Boards/Board/Documents";
import Groceries from "./Boards/Board/Groceries";
import Notes from "./Boards/Board/Notes";
import BoardRedirect from "./Boards/Board/Redirect";
import Tasks from "./Boards/Board/Tasks";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Navigate to="/boards" />,
      },
      {
        path: "boards",
        element: (
          <BoardsProvider>
            <Boards />
          </BoardsProvider>
        ),
        children: [
          {
            path: ":boardId",
            element: <Board />,
            children: [
              { index: true, element: <BoardRedirect /> },
              {
                path: "credentials",
                element: <Credentials />,
              },
              {
                path: "credentials/:credentialId",
                element: <Credentials />,
              },
              { path: "credit-cards", element: <CreditCards /> },
              { path: "credit-cards/:creditCardId", element: <CreditCards /> },
              { path: "documents", element: <Documents /> },
              { path: "documents/:documentId", element: <Documents /> },
              { path: "groceries", element: <Groceries /> },
              { path: "groceries/:groceryId", element: <Groceries /> },
              { path: "notes", element: <Notes /> },
              { path: "notes/:noteId", element: <Notes /> },
              { path: "tasks", element: <Tasks /> },
              { path: "tasks/:taskId", element: <Tasks /> },
              { path: "settings", element: <Settings /> },
            ],
          },
        ],
      },
    ],
  },
]);

const Home = () => {
  return <RouterProvider router={router} />;
};

export default Home;
