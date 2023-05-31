import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Boards from "routes/Home/Boards";
import Board from "routes/Home/Boards/Board";
import Chores from "routes/Home/Boards/Board/Chores";
import Credentials from "routes/Home/Boards/Board/Credentials";
import CreditCards from "routes/Home/Boards/Board/CreditCards";
import Documents from "routes/Home/Boards/Board/Documents";
import Groceries from "routes/Home/Boards/Board/Groceries";
import Lists from "routes/Home/Boards/Board/Lists";
import Notes from "routes/Home/Boards/Board/Notes";
import BoardRedirect from "routes/Home/Boards/Board/Redirect";
import Settings from "routes/Home/Boards/Board/Settings";
import Todos from "routes/Home/Boards/Board/Todos";
import BoardsProvider from "routes/Home/Boards/Provider";
import Error from "routes/Home/Error";

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
                path: "chores",
                element: <Chores />,
              },
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
              { path: "lists", element: <Lists /> },
              { path: "lists/:listId", element: <Lists /> },
              { path: "notes", element: <Notes /> },
              { path: "notes/:noteId", element: <Notes /> },
              { path: "todos", element: <Todos /> },
              { path: "todos/:todoId", element: <Todos /> },
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
