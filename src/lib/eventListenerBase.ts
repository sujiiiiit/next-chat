import type { ArgumentTypes, SuperReturnType } from './types';

export type EventListenerListeners = Record<string, (...args: unknown[]) => unknown>;

type ListenerObject<T> = { callback: T; options: boolean | AddEventListenerOptions | undefined };

export default class EventListenerBase<Listeners extends EventListenerListeners> {
  
  protected listeners!: Partial<{
    [k in keyof Listeners]?: Set<ListenerObject<Listeners[k]>>;
  }>;
  protected listenerResults!: Partial<{
    [k in keyof Listeners]: ArgumentTypes<Listeners[k]>;
  }>;

  private reuseResults: boolean = false;

  constructor(reuseResults?: boolean) {
    this._constructor(reuseResults);
  }

  public _constructor(reuseResults?: boolean): void {
    this.reuseResults = reuseResults ?? false;
    this.listeners = {};
    this.listenerResults = {};
  }

  public addEventListener<T extends keyof Listeners>(
    name: T,
    callback: Listeners[T],
    options?: boolean | AddEventListenerOptions
  ): void {
    const listenerObject: ListenerObject<Listeners[T]> = { callback, options: options ?? false };
    (this.listeners[name] ??= new Set()).add(listenerObject);

    if (this.listenerResults.hasOwnProperty(name)) {
      callback(...(this.listenerResults[name] ?? []));

      if ((listenerObject.options as AddEventListenerOptions)?.once) {
        this.listeners[name].delete(listenerObject);
        return;
      }
    }
  }

  public addMultipleEventsListeners(obj: {
    [name in keyof Listeners]?: Listeners[name];
  }): void {
    for (const i in obj) {
      if (obj[i]) {
        this.addEventListener(i, obj[i] as Listeners[typeof i]);
      }
    }
  }

  public removeEventListener<T extends keyof Listeners>(
    name: T,
    callback: Listeners[T],
   
  ): void {
    if (this.listeners[name]) {
      for (const l of this.listeners[name]) {
        if (l.callback === callback) {
          this.listeners[name].delete(l);
          break;
        }
      }
    }
  }

  protected invokeListenerCallback<T extends keyof Listeners, L extends ListenerObject<unknown>>(
    name: T,
    listener: L,
    ...args: ArgumentTypes<L['callback'] & ((...args: unknown[]) => unknown)>
  ): unknown {
    let result: unknown, error: unknown;
    try {
      result = (listener.callback as (...args: unknown[]) => unknown)(...args);
    } catch (err) {
      error = err;
    }

    if ((listener.options as AddEventListenerOptions)?.once) {
      this.removeEventListener(name, listener.callback as Listeners[T]);
    }

    if (error) {
      throw error;
    }

    return result;
  }

  private _dispatchEvent<T extends keyof Listeners>(
    name: T,
    collectResults: boolean,
    ...args: ArgumentTypes<Listeners[T]>
  ): SuperReturnType<Listeners[T]>[] | void {
    if (this.reuseResults) {
      this.listenerResults[name] = args;
    }

    const arr: Array<SuperReturnType<Listeners[typeof name]>> | undefined = collectResults ? [] : undefined;

    const listeners = this.listeners[name];
    if (listeners) {
      for (const listener of listeners) {
        const result = this.invokeListenerCallback(name, listener, ...args);
        if (arr) {
          arr.push(result as SuperReturnType<Listeners[T]>);
        }
      }
    }

    return arr;
  }

  public dispatchResultableEvent<T extends keyof Listeners>(
    name: T,
    ...args: ArgumentTypes<Listeners[T]>
  ): SuperReturnType<Listeners[T]>[] | void {
    return this._dispatchEvent(name, true, ...args);
  }

  public dispatchEvent<T extends keyof Listeners>(
    name: T,
    ...args: ArgumentTypes<Listeners[T]>
  ): void {
    this._dispatchEvent(name, false, ...args);
  }

  public cleanup(): void {
    this.listeners = {};
    this.listenerResults = {};
  }
}
