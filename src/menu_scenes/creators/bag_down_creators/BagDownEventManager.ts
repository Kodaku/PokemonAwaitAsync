import Phaser from 'phaser';
import { sceneEvents } from '~/events/EventCenter';
import BagDownRenderManager from './BagDownRenderManager';

export default class BagDownEventManager {
  constructor(public scene: Phaser.Scene) {}

  public createEvents(renderManager: BagDownRenderManager) {
    sceneEvents.on(
      'change-bag-anim',
      renderManager.renderAllBag,
      renderManager
    );
    sceneEvents.on('show-new-items', renderManager.renderItems, renderManager);
    sceneEvents.on('select-item', renderManager.selectItem, renderManager);
    sceneEvents.on(
      'change-command-texture',
      renderManager.renderCommands,
      renderManager
    );
    sceneEvents.on(
      'right-cursor-pressed',
      renderManager.manageRightCursorPress,
      renderManager
    );
    sceneEvents.on(
      'left-cursor-pressed',
      renderManager.manageLeftCursorPress,
      renderManager
    );
    sceneEvents.on(
      'A-pressed-bag',
      renderManager.renderVisibleCommands,
      renderManager
    );
    sceneEvents.on(
      'B-pressed-bag',
      renderManager.renderInvisibleCommands,
      renderManager
    );
  }

  public destroyEvents() {
    sceneEvents.off('change-bag-anim');
    sceneEvents.off('show-new-items');
    sceneEvents.off('select-item');
    sceneEvents.off('change-command-texture');
    sceneEvents.off('right-cursor-pressed');
    sceneEvents.off('left-cursor-pressed');
    sceneEvents.off('A-pressed-bag');
    sceneEvents.off('B-pressed-bag');
  }
}
