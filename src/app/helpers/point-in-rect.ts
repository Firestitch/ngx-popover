export function pointInRect(x1, y1, x2, y2, px, py) {
  return (px > x1 && px < x2) && (py > y1 && py < y2);
}
