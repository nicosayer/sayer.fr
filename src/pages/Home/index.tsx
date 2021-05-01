import { BackTop } from "antd";
import React, { useCallback, useRef } from "react";
import scrollIntoView from "scroll-into-view";

import Coming from "pages/Home/Coming";
import Footer from "pages/Home/Footer";
import Header from "pages/Home/Header";
import Logo from "pages/Home/Logo";
import Program from "pages/Home/Program";
import RSVP from "pages/Home/RSVP";
import Sleeping from "pages/Home/Sleeping";

const Home = () => {
  const programRef = useRef<any>();
  const comingRef = useRef<any>();
  const sleepingRef = useRef<any>();

  const openRoute = useCallback((route: number) => {
    setTimeout(() => {
      switch (route) {
        case 1:
          return scrollIntoView(programRef.current);
        case 2:
          return scrollIntoView(comingRef.current);
        case 3:
          return scrollIntoView(sleepingRef.current);
        default:
          return null;
      }
    }, 0);
  }, []);

  return (
    <>
      <BackTop />
      <Header openRoute={openRoute} />
      <Logo />
      <div ref={programRef}>
        <Program />
      </div>
      <div ref={comingRef}>
        <Coming />
      </div>
      <div ref={sleepingRef}>
        <Sleeping />
      </div>
      <RSVP />
      <Footer />
    </>
  );
};

export default Home;
