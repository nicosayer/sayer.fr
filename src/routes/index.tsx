import FullPageLoading from "providers/FullPageLoading/FullPage";
import { useAuthState } from "react-firebase-hooks/auth";
import Auth from "routes/Auth";
import Home from "routes/Home";
import { auth } from "utils/firebase";

const Routes = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <FullPageLoading />;
  }

  if (!user) {
    return <Auth />;
  }

  return <Home />;
};

export default Routes;
