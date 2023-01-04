import AppShell from "components/atoms/AppShell";
import useDefaultBoardTab from "hooks/useDefaultBoardTab";
import FullPageLoading from "providers/FullPageLoading/FullPage";
import { Outlet, useParams } from "react-router-dom";
import Header from "routes/Home/Boards/Board/Header";
import Navbar from "routes/Home/Boards/Board/Navbar";
import BoardProvider from "routes/Home/Boards/Board/Provider";
import Spotlight from "./Spotlight";

const Board = () => {
  const { boardId } = useParams();

  useDefaultBoardTab();

  if (!boardId) {
    return <FullPageLoading />;
  }

  return (
    <BoardProvider boardId={boardId}>
      <Spotlight>
        <AppShell header={<Header />} navbar={<Navbar />}>
          <Outlet />
        </AppShell>
      </Spotlight>
    </BoardProvider>
  );
};

export default Board;
