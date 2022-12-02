import AppShell from "components/atoms/AppShell";
import FullPageLoading from 'providers/FullPageLoading/FullPage';
import { Outlet, useParams } from "react-router-dom";
import Header from "routes/Home/Boards/Board/Header";
import Navbar from "routes/Home/Boards/Board/Navbar";
import BoardProvider from "routes/Home/Boards/Board/Provider";

const Board = () => {
  const { boardId } = useParams();

  if (!boardId) {
    return <FullPageLoading />
  }

  return (
    <BoardProvider boardId={boardId}>
      <AppShell header={<Header />} navbar={<Navbar />}>
        <Outlet />
      </AppShell>
    </BoardProvider>
  );
};

export default Board;
