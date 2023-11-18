import { useState, useEffect } from 'react';
import {debounce} from "@/helpers/debounce";

export const useWindowDimension = (msDelay = 100) => {
  const [dimension, setDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const resizeHandler = () => {
      setDimension({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    const handler = msDelay <= 0 ? resizeHandler : debounce(resizeHandler, msDelay);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  });
  return dimension;
};

export type Dimension = ReturnType<typeof useWindowDimension>;
