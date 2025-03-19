"use client";

export function changeScrollActive() {
  if (typeof window !== "undefined")
    window.document.body.classList.toggle("scroll_disable");
}
