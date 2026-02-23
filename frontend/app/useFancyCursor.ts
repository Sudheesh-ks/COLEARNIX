"use client";

import { RefObject, useEffect } from "react";

export function useFancyCursor(
  cursorRef: RefObject<HTMLDivElement | null>,
  trailRef: RefObject<HTMLDivElement | null>,
  gridRef?: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = "none";

    let mx = 0;
    let my = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      if (cursorRef.current) {
        cursorRef.current.style.left = mx + "px";
        cursorRef.current.style.top = my + "px";
      }

      setTimeout(() => {
        if (trailRef.current) {
          trailRef.current.style.left = mx + "px";
          trailRef.current.style.top = my + "px";
        }
      }, 80);
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Hover scale effect
    const interactables = document.querySelectorAll(
      "button, a, .sn-room-card, .sn-feature-card"
    );

    const onEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = "translate(-50%, -50%) scale(2.5)";
      }
    };

    const onLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = "translate(-50%, -50%) scale(1)";
      }
    };

    interactables.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // Scroll reveal
    const reveals = document.querySelectorAll(".sn-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("sn-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    reveals.forEach((el) => observer.observe(el));

    // Floating symbols (hero grid)
    const symbols = ["{}", "//", "<>", "=>", "[]", "&&", "!=", "**"];
    const floatingEls: HTMLDivElement[] = [];

    if (gridRef?.current) {
      for (let i = 0; i < 8; i++) {
        const span = document.createElement("div");
        span.style.cssText = `
          position: absolute;
          left: ${Math.random() * 90 + 5}%;
          top: ${Math.random() * 90 + 5}%;
          font-family: monospace;
          font-size: ${11 + Math.random() * 6}px;
          color: rgba(110,231,183,${0.06 + Math.random() * 0.08});
          pointer-events: none;
          animation: sn-float ${4 + Math.random() * 4}s ease-in-out infinite;
          animation-delay: ${Math.random() * 4}s;
        `;
        span.textContent = symbols[i];
        gridRef.current.appendChild(span);
        floatingEls.push(span);
      }
    }

    return () => {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", handleMouseMove);

      interactables.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });

      observer.disconnect();
      floatingEls.forEach((el) => el.remove());
    };
  }, [cursorRef, trailRef, gridRef]);
}