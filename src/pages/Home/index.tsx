import { BackTop } from "antd";
import React, { useCallback, useMemo, useRef, useState } from "react";
import scrollIntoView from "scroll-into-view";

import Coming from "pages/Home/Coming";
import Header from "pages/Home/Header";
import Logo from "pages/Home/Logo";
import Program from "pages/Home/Program";
import Sleeping from "pages/Home/Sleeping";

const Home = () => {
  const ref = useRef<any>();
  const [route, setRoute] = useState<number>();

  const openRoute = useCallback((route?: number) => {
    setRoute(route);
    if (route) {
      setTimeout(() => {
        scrollIntoView(ref.current);
      }, 0);
    }
  }, []);

  const routeSwitch = useMemo(() => {
    switch (route) {
      case 1:
        return <Program />;
      case 2:
        return <Coming />;
      case 3:
        return <Sleeping />;
      default:
        return null;
    }
  }, [route]);

  return (
    <>
      <BackTop />
      <Header openRoute={openRoute} />
      <Logo />
      <div ref={ref}>{routeSwitch}</div>
    </>
  );
};

export default Home;
