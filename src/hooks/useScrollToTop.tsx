import {useState, useEffect} from "react";
import {FiChevronUp} from 'react-icons/fi';

interface ScrollToTopProps {
  heightToShowButton?: number;
}

const useScrollToTop = ({heightToShowButton = 400}: ScrollToTopProps) => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToTop = () => {
    if (!showScrollButton && window.scrollY > heightToShowButton) {
      setShowScrollButton(true);
    } else if (showScrollButton && window.scrollY <= heightToShowButton) {
      setShowScrollButton(false);
    }
  }

  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    window.addEventListener("scroll", scrollToTop);
    return function cleanup() {
      window.removeEventListener("scroll", scrollToTop);
    }
  });

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", scrollToTop);
  }
  return (
    <>
      <FiChevronUp className="scroll-to-top fixed right-20 bottom-20 bg-blue-950 text-white h-12 w-12 p-2 rounded-full cursor-pointer flex items-center justify-center" onClick={backToTop} style={{
        display: showScrollButton ? "flex" : "none"
      }}/>
    </>
  );
}

export default useScrollToTop;
