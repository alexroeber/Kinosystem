import {HashSet} from "./HashSet";
import {Platz} from "../fachwerte/Platz";
import {Geldbetrag} from "../fachwerte/Geldbetrag";
import {EqualsHashCode} from "./EqualsHashCode";

class Testklasse implements EqualsHashCode {
  private a: number;

  constructor(private id: number) {
  }

  public setA(a: number) {
    this.a = a;
  }

  public getA() {
    return this.a;
  }

  equals(obj: any): boolean {
    return obj instanceof Testklasse && obj.id === this.id;
  }

  hashCode(): number {
    return this.id;
  }
}

describe("HashSet", () => {
  let filledSet: HashSet<Platz>;
  let emptySet: HashSet<Geldbetrag>;

  beforeEach(() => {
    filledSet = new HashSet<Platz>();
    filledSet.add(new Platz(0, 0));
    filledSet.add(new Platz(1, 0));
    filledSet.add(new Platz(0, 1));
    filledSet.add(new Platz(1, 1));
    emptySet = new HashSet<Geldbetrag>();
  });

  it("teste add", () => {
    expect(4).toBe(filledSet.size());
    filledSet.add(new Platz(0, 0));
    filledSet.add(new Platz(1, 0));
    filledSet.add(new Platz(0, 1));
    filledSet.add(new Platz(1, 1));
    expect(4).toBe(filledSet.size());
    expect(0).toBe(emptySet.size());
    emptySet.add(Geldbetrag.parseGeldbetrag(0, 0));
    emptySet.add(Geldbetrag.parseGeldbetrag(1, 1));
    emptySet.add(Geldbetrag.parseGeldbetrag("1,01 €"));
    expect(2).toBe(emptySet.size());
  });

  it("teste clear/contains", () => {
    expect(4).toBe(filledSet.size());
    expect(true).toBe(filledSet.contains(new Platz(0, 0)));
    expect(true).toBe(filledSet.contains(new Platz(1, 1)));
    expect(false).toBe(filledSet.contains(new Platz(2, 0)));
    filledSet.clear();
    expect(false).toBe(filledSet.contains(new Platz(0, 0)));
    expect(0).toBe(filledSet.size());
  });

  it("teste forEach", () => {
    const set = new HashSet<Testklasse>();
    const test1 = new Testklasse(0);
    const test2 = new Testklasse(0);
    const test3 = new Testklasse(1);
    const test4 = new Testklasse(2);
    const test5 = new Testklasse(3);
    set.add(test1);
    set.add(test2);
    set.add(test3);
    set.add(test4);
    set.add(test5);
    expect(4).toBe(set.size());
    expect(undefined).toBe(test1.getA());
    expect(undefined).toBe(test2.getA());
    expect(undefined).toBe(test3.getA());
    expect(undefined).toBe(test4.getA());
    expect(undefined).toBe(test5.getA());
    set.forEach(val => val.setA(9));
    expect(9).toBe(test1.getA());
    expect(undefined).toBe(test2.getA());
    expect(9).toBe(test3.getA());
    expect(9).toBe(test4.getA());
    expect(9).toBe(test5.getA());
  });

  it("teste remove", () => {
    expect(4).toBe(filledSet.size());
    expect(true).toBe(filledSet.remove(new Platz(0, 0)));
    expect(3).toBe(filledSet.size());
    filledSet.add(new Platz(0, 0));
    expect(4).toBe(filledSet.size());
    expect(true).toBe(filledSet.remove(new Platz(1, 0)));
    expect(true).toBe(filledSet.remove(new Platz(1, 1)));
    expect(false).toBe(filledSet.remove(new Platz(1, 1)));
    expect(2).toBe(filledSet.size());
  });
});
