"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";

export interface CountingNumberProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  grouping?: boolean;
  separator?: string;
  trigger?: "view" | "mount";
}

export function CountingNumber({
  value,
  from = 0,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  grouping = true,
  separator = ",",
  trigger = "view",
  className,
  ...props
}: CountingNumberProps) {
  const [displayValue, setDisplayValue] = useState<string>(
    from.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: grouping,
    })
  );
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    function formatNumber(num: number): string {
      const fixed = num.toFixed(decimals);
      if (!grouping) return fixed;

      const [intPart, decPart] = fixed.split(".");
      const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
    }

    function animate() {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const startTime = performance.now();
      const totalDuration = duration * 1000;

      function step(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);
        
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = from + (value - from) * ease;

        setDisplayValue(formatNumber(current));

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplayValue(formatNumber(value));
        }
      }

      requestAnimationFrame(step);
    }

    if (trigger === "mount") {
      animate();
      return;
    }

    if (typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimatedRef.current) {
              animate();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1, rootMargin: "50px" }
      );

      observer.observe(element);
      return () => observer.disconnect();
    } else {
      animate();
    }
  }, [value, from, duration, decimals, grouping, separator, trigger]);

  return (
    <span ref={elementRef} className={className} {...props}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

