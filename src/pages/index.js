import Home from "pages/Home";
import Login from "pages/Login";
import { useUser } from "providers/UserProvider";

function Root() {
  const { isAuth, loading } = useUser();

  if (isAuth) {
    return <Home />;
  }

  return <Login loading={loading} />;
}

export default Root;
