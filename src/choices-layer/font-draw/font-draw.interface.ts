export interface FontDraw {
  clearLetters(): void;
  drawLetters(text: string, textWidth: number, textHeight: number): [number, number];
  getCurrentLineMaxHeight(): number;
}
