import { useGetCurrentUser } from "hooks/useGetCurrentUser";
import Home from "pages/Home";
import Login from "pages/Login";

function Root() {
  const { isAuth, loading } = useGetCurrentUser();

  if (isAuth) {
    return <Home />;
  }

  return <Login loading={loading} />;
}

export default Root;
