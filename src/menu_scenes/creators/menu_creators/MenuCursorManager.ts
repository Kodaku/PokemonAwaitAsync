import { sceneEvents } from '~/events/EventCenter';

export default class MenuCursorManger {
  private cursorPosition: number = 0;
  public decrementCursor(amount: number) {
    this.cursorPosition -= amount;
    if (this.cursorPosition < 0) {
      this.cursorPosition += amount;
    } else {
      sceneEvents.emit('change-texture', this.cursorPosition);
    }
  }

  public incrementCursor(amount: number, maxLength: number) {
    this.cursorPosition += amount;
    if (this.cursorPosition >= maxLength) {
      this.cursorPosition -= amount;
    } else {
      sceneEvents.emit('change-texture', this.cursorPosition);
    }
  }

  public getCursorPosition(): number {
    return this.cursorPosition;
  }
}
