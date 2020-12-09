import { sceneEvents } from '~/events/EventCenter';

export default class PartyCursorManager {
  private cursorPosition: number = 0;
  private commandCursor: number = 0;

  public decrementCursorPosition(amount: number) {
    this.cursorPosition -= amount;
    if (this.cursorPosition < 0) {
      this.cursorPosition += amount;
    } else {
      sceneEvents.emit('change-anim', this.cursorPosition);
    }
  }

  public incrementCursorPosition(amount: number, maxLength: number) {
    this.cursorPosition += amount;
    if (this.cursorPosition >= maxLength) {
      this.cursorPosition -= amount;
    } else {
      sceneEvents.emit('change-anim', this.cursorPosition);
    }
  }

  public decrementCommandCursor() {
    this.commandCursor--;
    if (this.commandCursor < 0) {
      this.commandCursor++;
    } else {
      sceneEvents.emit('change-command-texture', this.commandCursor);
    }
  }

  public incrementCommandCursor(maxLength: number) {
    this.commandCursor++;
    if (this.commandCursor >= maxLength) {
      this.commandCursor--;
    } else {
      sceneEvents.emit('change-command-texture', this.commandCursor);
    }
  }

  public getCommandCursor(): number {
    return this.commandCursor;
  }

  public getCursorPosition(): number {
    return this.cursorPosition;
  }
}
