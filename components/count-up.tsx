"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  to: number;
  decimals?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function CountUp({ to, decimals = 0, duration = 1000, suffix = "", prefix = "" }: CountUpProps) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * to).toFixed(decimals)));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [to, decimals, duration]);

  return (
    <>{prefix}{value.toFixed(decimals)}{suffix}</>
  );
}
