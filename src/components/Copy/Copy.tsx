"use client";
// import "./Copy.css";
import React, { useRef } from "react";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface CopyProps {
  children: React.ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
}

export default function Copy({ children, animateOnScroll = true, delay = 0 }: CopyProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const elementRefs = useRef<HTMLElement[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const splitRefs = useRef<any[]>([]);
  const lines = useRef<HTMLElement[]>([]);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Timeout de seguridad para asegurar que el texto sea visible
  React.useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (!isInitialized && containerRef.current) {
        console.warn("Copy component: Safety timeout reached, showing text");
        gsap.set(containerRef.current, { y: "0%", opacity: 1 });
        setIsInitialized(true);
      }
    }, 3000); // 3 segundos de timeout

    return () => clearTimeout(safetyTimeout);
  }, [isInitialized]);

  const waitForFonts = async () => {
    try {
      await document.fonts.ready;

      const customFonts = ["Manrope"];
      const fontCheckPromises = customFonts.map((fontFamily) => {
        return document.fonts.check(`16px ${fontFamily}`);
      });

      await Promise.all(fontCheckPromises);
      await new Promise((resolve) => setTimeout(resolve, 100));

      return true;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return true;
    }
  };

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const initializeSplitText = async () => {
        try {
          await waitForFonts();

        splitRefs.current = [];
        lines.current = [];
        elementRefs.current = [];


        let elements: HTMLElement[] = [];
        if (containerRef.current && containerRef.current.hasAttribute("data-copy-wrapper")) {
          elements = Array.from(containerRef.current.children) as HTMLElement[];
        } else if (containerRef.current) {
          elements = [containerRef.current];
        }

        elements.forEach((element) => {
          elementRefs.current.push(element);

          const split = SplitText.create(element, {
            type: "lines",
            mask: "lines",
            linesClass: "line++",
            lineThreshold: 0.1,
          });

          splitRefs.current.push(split);

          const computedStyle = window.getComputedStyle(element);
          const textIndent = computedStyle.textIndent;

          if (textIndent && textIndent !== "0px") {
            if (split.lines.length > 0) {
              (split.lines[0] as HTMLElement).style.paddingLeft = textIndent;
            }
            element.style.textIndent = "0";
          }

          lines.current.push(...split.lines.map(line => line as HTMLElement));
        });

        gsap.set(lines.current, { y: "100%" });

        const animationProps = {
          y: "0%",
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          delay: delay,
        };

        if (animateOnScroll) {
          gsap.to(lines.current, {
            ...animationProps,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 90%",
              once: true,
            },
          });
          } else {
            gsap.to(lines.current, animationProps);
          }
          
          setIsInitialized(true);
        } catch (error) {
          // Fallback: si la animación falla, asegurar que el texto sea visible
          console.warn("Copy animation failed, showing text without animation:", error);
          if (containerRef.current) {
            gsap.set(containerRef.current, { y: "0%", opacity: 1 });
          }
          setIsInitialized(true);
        }
      };

      initializeSplitText();

      return () => {
        splitRefs.current.forEach((split) => {
          if (split) {
            split.revert();
          }
        });
      };
    },
    { scope: containerRef, dependencies: [animateOnScroll, delay] }
  );

  if (
    React.Children.count(children) === 1 &&
    React.isValidElement(children)
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return React.cloneElement(children as React.ReactElement<any>, { ref: containerRef });
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}
