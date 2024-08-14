export interface EventListener {
  (...args: any[]): void;
}

export class EventEmitter {
  events: Record<string, Set<EventListener>> = {};

  private _getEventListByName(eventName: string) {
    if (typeof this.events[eventName] === 'undefined') this.events[eventName] = new Set();

    return this.events[eventName];
  }

  on(eventName: string, fn: EventListener) {
    this._getEventListByName(eventName).add(fn);
  }

  once(eventName: string, fn: EventListener) {
    const onceFn = (...args: any[]) => {
      this.removeListener(eventName, onceFn);
      fn.apply(this, args);
    };

    this.on(eventName, onceFn);
  }

  emit(eventName: string, ...args: any[]) {
    this._getEventListByName(eventName).forEach((fn: EventListener) => {
      fn.apply(this, args);
    });
  }

  removeListener(eventName: string, fn: EventListener) {
    this._getEventListByName(eventName).delete(fn);
  }
}
