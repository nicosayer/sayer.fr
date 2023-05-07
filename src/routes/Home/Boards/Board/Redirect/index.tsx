import useDefaultBoardTab from "hooks/useDefaultBoardTab";
import { FC } from "react";
import { Navigate } from "react-router-dom";

const BoardRedirect: FC = () => {
  const defaultBoardTab = useDefaultBoardTab();

  return <Navigate to={defaultBoardTab} />;
};

export default BoardRedirect;
