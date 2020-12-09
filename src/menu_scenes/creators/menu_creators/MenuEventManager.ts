import Phaser from 'phaser';
import { sceneEvents } from '~/events/EventCenter';
import MenuRenderManager from './MenuRenderManager';

export default class MenuEventManager {
  constructor() {}

  public createEvents(renderManager: MenuRenderManager) {
    sceneEvents.on('change-texture', renderManager.renderAll, renderManager);
  }
}
