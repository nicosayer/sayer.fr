import { useWindowWidth } from "@react-hook/window-size";

const useIsMobile = () => {
  const windowWidth = useWindowWidth();

  return windowWidth < 768;
};

export default useIsMobile;
