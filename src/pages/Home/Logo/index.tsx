import { x } from "@xstyled/emotion";
import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

import useIsMobile from "hooks/useIsMobile";

const Logo = () => {
  const [clicked, setClicked] = useState(false);
  const [hover, setHover] = useState(false);
  const isMobile = useIsMobile();
  const [music, setMusic] = useState<HTMLAudioElement>();

  useEffect(() => {
    setMusic(
      new Audio(process.env.PUBLIC_URL + "/sounds/TooLateToTurnBackNow.mp3")
    );
  }, []);

  useEffect(() => {
    if (music && clicked) {
      if (hover) {
        music.play();
      } else {
        music.pause();
      }
    }
  }, [hover, music, clicked]);

  return (
    <>
      <x.div
        zIndex={1005}
        pointerEvents="none"
        position="fixed"
        top={0}
        right={0}
        bottom={0}
        left={0}
      >
        <Confetti numberOfPieces={hover && clicked ? 200 : 0} />
      </x.div>
      <x.div
        h="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Tooltip
          title={
            clicked
              ? undefined
              : isMobile
              ? undefined
              : "Cliquez pour lancer la musique"
          }
        >
          <x.div
            fontFamily="Caslon"
            fontSize={64}
            cursor={
              clicked && hover
                ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='96' viewport='0 0 100 100' style='fill:black;font-size:48px;'><text y='50%'>🎉</text></svg>") 16 0, auto`
                : clicked
                ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='96' viewport='0 0 100 100' style='fill:black;font-size:48px;'><text y='50%'>🎶</text></svg>") 16 0, auto`
                : "pointer"
            }
            onMouseEnter={() => {
              if (!isMobile) {
                setHover(true);
              }
            }}
            onMouseLeave={() => {
              setHover(false);
            }}
            onClick={() => {
              if (!clicked) {
                setClicked(true);
              }
              if (isMobile || clicked) {
                setHover((old) => !old);
              }
            }}
          >
            <x.div>
              <x.div opacity={hover ? 0.4 : 1} transition="all 0.4s">
                charlotte
              </x.div>
              <x.div opacity={hover ? 0.4 : 1} transition="all 0.4s">
                & nicolas
              </x.div>
            </x.div>
            <x.div
              h={hover ? (isMobile ? 100 : 201) : 0}
              overflow="hidden"
              transition="all 0.4s"
              fontSize={isMobile ? undefined : 128}
              className="text-gradient"
            >
              octave
            </x.div>
          </x.div>
        </Tooltip>
      </x.div>
    </>
  );
};

export default Logo;
