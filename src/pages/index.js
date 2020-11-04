import { useCurrentUser } from "hooks/useCurrentUser";
import Home from "pages/Home";
import Login from "pages/Login";

function Root() {
  const { isAuth, loading } = useCurrentUser();

  if (isAuth) {
    return <Home />;
  }

  return <Login loading={loading} />;
}

export default Root;
