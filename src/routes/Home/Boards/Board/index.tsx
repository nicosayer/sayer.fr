import { ModalsProvider } from "@mantine/modals";
import AppShell from "components/atoms/AppShell";
import useDefaultBoardId from "hooks/useDefaultBoardId";
import useDefaultBoardTab from "hooks/useDefaultBoardTab";
import FullPageLoading from "providers/FullPageLoading/FullPage";
import { Outlet, useParams } from "react-router-dom";
import Header from "routes/Home/Boards/Board/Header";
import Navbar from "routes/Home/Boards/Board/Navbar";
import BoardProvider from "routes/Home/Boards/Board/Provider";
import Spotlight from "routes/Home/Boards/Board/Spotlight";

const Board = () => {
  const { boardId } = useParams();

  useDefaultBoardId();
  useDefaultBoardTab();

  if (!boardId) {
    return <FullPageLoading />;
  }

  return (
    <BoardProvider boardId={boardId}>
      <ModalsProvider>
        <Spotlight>
          <AppShell header={<Header />} navbar={<Navbar />}>
            <Outlet />
          </AppShell>
        </Spotlight>
      </ModalsProvider>
    </BoardProvider>
  );
};

export default Board;
