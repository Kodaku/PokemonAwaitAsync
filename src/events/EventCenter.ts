import Phaser from 'phaser';

const sceneEvents = new Phaser.Events.EventEmitter();

class EventEmitterHandler extends Phaser.Events.EventEmitter {
  private static instance: EventEmitterHandler;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!EventEmitterHandler.instance) {
      EventEmitterHandler.instance = new EventEmitterHandler();
    }
    return EventEmitterHandler.instance;
  }
}

export { sceneEvents, EventEmitterHandler };
