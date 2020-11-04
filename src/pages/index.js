import Home from "pages/Home";
import Login from "pages/Login";
import { useCurrentUser } from "providers/CurrentUserProvider";

function Root() {
  const { isAuth, loading } = useCurrentUser();

  if (isAuth) {
    return <Home />;
  }

  return <Login loading={loading} />;
}

export default Root;
