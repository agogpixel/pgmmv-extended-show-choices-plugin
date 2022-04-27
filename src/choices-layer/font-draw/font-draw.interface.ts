/**
 * Exports FontDraw interfaces.
 *
 * @module choices-layer/font-draw/font-draw.interface
 */

/**
 * Interface for a Cocos layer capable of drawing a line of text.
 */
export interface FontDraw {
  /**
   * Clear all currently drawn letters.
   */
  clearLetters(): void;

  /**
   * Draw a line of text to the screen. Supports the following text tag
   * functions:
   * - Increase font size by `\S[+{number}]`
   * - Decrease font size by `\S[-{number}]`
   * - Return to original font size `\S[]`
   * - Use specific font size `\S[{number}]` (assumed to be a positive,
   *   non-zero, scalar value).
   * - Set text color `\C[#rgb]` or `\C[#rrggbb]`.
   * - Return to original text color `\C[]`.
   *
   * @param text Line of text to be drawn. Anything after a '\n' is ignored.
   * @param textWidth Accumulated text width drawn to screen, so far. This value
   * can 'wrap' back to zero as text is drawn.
   * @param textHeight Accumulated text height drawn to screen, so far.
   * @returns The accumlated [textWidth, textHeight] after drawing the text to
   * the screen.
   */
  drawLetters(text: string, textWidth: number, textHeight: number): [number, number];

  /**
   * Get the current line's maximum letter height out of all currently drawn
   * letters.
   *
   * @returns Maximum line height for the currently drawn line.
   */
  getCurrentLineMaxHeight(): number;
}
