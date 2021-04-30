import { BackTop } from "antd";
import React, { useCallback, useMemo, useRef, useState } from "react";

import Coming from "pages/Home/Coming";
import Header from "pages/Home/Header";
import Logo from "pages/Home/Logo";
import Program from "pages/Home/Program";

const Home = () => {
  const ref = useRef<any>();
  const [route, setRoute] = useState<number>();

  const openRoute = useCallback((route?: number) => {
    setRoute(route);
    if (route) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ block: "start", behavior: "smooth" });
      }, 0);
    }
  }, []);

  const routeSwitch = useMemo(() => {
    switch (route) {
      case 1:
        return <Program />;
      case 2:
        return <Coming />;
      default:
        return null;
    }
  }, [route]);

  return (
    <>
      <BackTop />
      <Header openRoute={openRoute} />
      <Logo openRoute={openRoute} />
      <div ref={ref}>{routeSwitch}</div>
    </>
  );
};

export default Home;
