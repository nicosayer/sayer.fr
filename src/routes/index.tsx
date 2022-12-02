import { auth } from "configs/firebase";
import FullPageLoading from "providers/FullPageLoading/FullPage";
import { useAuthState } from "react-firebase-hooks/auth";
import Auth from "routes/Auth";
import Home from "routes/Home";

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
