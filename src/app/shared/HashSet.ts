import {EqualsHashCode} from "./EqualsHashCode";

export class HashSet<T extends EqualsHashCode> {
  private length: number;

  private members: T[][];
  private currentSize;

  constructor(initial?: ArrayLike<T> | HashSet<T>) {
    if (initial) {
      if (initial instanceof HashSet) {
        this.currentSize = initial.length;
        this.init();
        initial.forEach(value => this.add(value));
      } else {
        this.currentSize = initial.length;
        this.init();
        for (let i = 0; i < this.currentSize; i++) {
          this.add(initial[i]);
        }
      }
    } else {
      this.currentSize = 10;
      this.init();
    }
  }

  public add(value: T): this {
    if (!this.contains(value)) {
      this.members[value.hashCode() % this.currentSize].push(value);
      this.length++;
      if (this.length > this.currentSize) {
        setTimeout(() => this.expandSize(), 0);
      }
    }
    return this;
  }

  public clear(): void {
    this.init();
  }

  public contains(value: T): boolean {
    const list = this.members[value.hashCode() % this.currentSize];
    return list.findIndex(val => val.equals(value)) >= 0;
  }

  public forEach(callbackfn: (value: T, set: HashSet<T>) => void): void {
    for (const value of this.flatMembers()) {
      callbackfn(value, this);
    }
  }

  public remove(value: T): boolean {
    const list = this.members[value.hashCode() % this.currentSize];
    const i = list.findIndex(val => val.equals(value));
    if (i >= 0) {
      list.splice(i, 1);
      this.length--;
      return true;
    }
    return false;
  }

  public size() {
    return this.length;
  }

  private init() {
    this.members = new Array(this.currentSize);
    this.length = 0;
    for (let i = 0; i < this.currentSize; i++) {
      this.members[i] = [];
    }
  }

  private flatMembers() {
    return this.members.reduce((all, next) => [...all, ...next], []);
  }

  private expandSize() {
    const old = this.flatMembers();
    this.currentSize *= 2;
    this.init();
    old.forEach(val => this.add(val));
  }
}
