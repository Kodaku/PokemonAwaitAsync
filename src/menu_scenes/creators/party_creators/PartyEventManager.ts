import Phaser from 'phaser';
import { sceneEvents } from '~/events/EventCenter';
import PartyRenderManager from './PartyRenderManager';

export default class PartyEventManager {
  public createEvents(renderManager: PartyRenderManager) {
    sceneEvents.on('change-anim', renderManager.renderAll, renderManager);
    sceneEvents.on(
      'warning-health',
      renderManager.showWarningHealth,
      renderManager
    );
    sceneEvents.on(
      'dangerous-health',
      renderManager.showDangerousHealth,
      renderManager
    );
    sceneEvents.on(
      'change-command-texture',
      renderManager.renderCommands,
      renderManager
    );
    sceneEvents.on(
      'A-pressed-command',
      renderManager.renderVisibleCommands,
      renderManager
    );
    sceneEvents.on(
      'B-pressed-command',
      renderManager.renderInvisibleCommands,
      renderManager
    );
    sceneEvents.on(
      'decrease-health',
      renderManager.decreasePokemonHP,
      renderManager
    );
    sceneEvents.on('check-health', renderManager.checkHealths, renderManager);
    // sceneEvents.on(
    //   'switch-members',
    //   renderManager.switchMembers,
    //   renderManager
    // );
  }

  public destroyEvents() {
    sceneEvents.off('change-anim');
    sceneEvents.off('warning-health');
    sceneEvents.off('dangerous-health');
    sceneEvents.off('change-command-texture');
    sceneEvents.off('A-pressed-command');
    sceneEvents.off('B-pressed-command');
    sceneEvents.off('decrease-health');
    sceneEvents.off('check-health');
    // sceneEvents.off('switch-members');
  }
}
