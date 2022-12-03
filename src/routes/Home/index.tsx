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
import Documents from "./Boards/Board/Documents";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Navigate to="boards" />,
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
              { index: true, element: <Navigate to="credentials" /> },
              {
                path: "credentials",
                element: <Credentials />,
              },
              {
                path: "credentials/:credentialId",
                element: <Credentials />,
              },
              { path: "documents", element: <Documents /> },
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
