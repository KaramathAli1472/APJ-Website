import { useEffect, useState } from "react";

const getScreenType = (width) => {
  if (width <= 600) {
    return "mobile";
  }

  if (width <= 1024) {
    return "tablet";
  }

  return "desktop";
};

function useResponsive() {
  const [screenType, setScreenType] = useState(() =>
    getScreenType(window.innerWidth)
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenType(
        getScreenType(window.innerWidth)
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  return {
    screenType,
    isMobile: screenType === "mobile",
    isTablet: screenType === "tablet",
    isDesktop: screenType === "desktop",
  };
}

export default useResponsive;