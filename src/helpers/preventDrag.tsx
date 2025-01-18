import React from "react";

export function preventDrag(event: React.DragEvent) {
  event.stopPropagation();
  event.preventDefault();
}