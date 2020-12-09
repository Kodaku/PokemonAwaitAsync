import { bag } from '~/constants/Constants';
import { sceneEvents } from '~/events/EventCenter';
import { Item } from '~/types/myTypes';

export default class BagDownCursorManager {
  private animsCursor: number = 0;
  private commandCursor: number = 0;
  private itemsCursor: number[] = [0, 0, 0, 0, 0];
  private items: Item[][] = [];
  public incrementItemCursor() {
    this.itemsCursor[this.animsCursor]++;
    if (
      this.itemsCursor[this.animsCursor] >= this.items[this.animsCursor].length
    ) {
      this.itemsCursor[this.animsCursor]--;
    } else {
      if (this.itemsCursor[this.animsCursor] > 5) {
        sceneEvents.emit('show-new-items', this.itemsCursor, this.animsCursor);
      }
      sceneEvents.emit('select-item', this.itemsCursor, this.animsCursor);
    }
  }

  public decrementItemCursor() {
    this.itemsCursor[this.animsCursor]--;
    if (this.itemsCursor[this.animsCursor] < 0) {
      this.itemsCursor[this.animsCursor]++;
    } else {
      if (this.itemsCursor[this.animsCursor] >= 5) {
        sceneEvents.emit('show-new-items', this.itemsCursor, this.animsCursor);
      }
      sceneEvents.emit('select-item', this.itemsCursor, this.animsCursor);
    }
  }

  public incrementAnimsCursor(maxLength: number) {
    //remeber that is this.bagAnims.length
    this.animsCursor++;
    if (this.animsCursor >= maxLength) {
      this.animsCursor--;
    } else {
      sceneEvents.emit('change-bag-anim', this.animsCursor);
      sceneEvents.emit('right-cursor-pressed', this.animsCursor);
    }
  }

  public decrementAnimsCursor() {
    this.animsCursor--;
    if (this.animsCursor < 0) {
      this.animsCursor++;
    } else {
      sceneEvents.emit('change-bag-anim', this.animsCursor);
      sceneEvents.emit('left-cursor-pressed', this.animsCursor);
    }
  }

  public incrementCommandCursor(maxLenght: number) {
    this.commandCursor++;
    if (this.commandCursor >= maxLenght) {
      this.commandCursor--;
    } else {
      sceneEvents.emit('change-command-texture', this.commandCursor);
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

  public setItems(items: Item[][]) {
    this.items = items;
  }

  public getCommandCursor(): number {
    return this.commandCursor;
  }

  public getAnimsCursor(): number {
    return this.animsCursor;
  }

  public getItemIndex(): number {
    return this.itemsCursor[this.animsCursor];
  }
}
