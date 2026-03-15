"use client";

import { useRef } from "react";
import { useFancyCursor } from "../hooks/useFancyCursor";

export default function GlobalFancyCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useFancyCursor(cursorRef, trailRef);

  return (
    <>
      <div className="sn-cursor" ref={cursorRef} />
      <div className="sn-cursor-trail" ref={trailRef} />
      <div className="sn-noise" />
    </>
  );
}