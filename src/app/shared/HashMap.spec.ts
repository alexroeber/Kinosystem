import {Platz} from "../fachwerte/Platz";
import {Geldbetrag} from "../fachwerte/Geldbetrag";
import {EqualsHashCode} from "./EqualsHashCode";
import {HashMap} from "./HashMap";

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

describe("HashMap", () => {
  let filledSet: HashMap<Platz, number>;
  let emptySet: HashMap<Geldbetrag, number>;

  beforeEach(() => {
    filledSet = new HashMap();
    filledSet.put(new Platz(5, 5), 0);
    filledSet.put(new Platz(5, 6), 1);
    filledSet.put(new Platz(6, 5), 2);
    filledSet.put(new Platz(6, 6), 3);
    emptySet = new HashMap();
  });

  it("teste put", () => {
    expect(4).toBe(filledSet.size());
    expect(0).toBe(filledSet.put(new Platz(5, 5), 5));
    expect(1).toBe(filledSet.put(new Platz(5, 6), 6));
    expect(2).toBe(filledSet.put(new Platz(6, 5), 7));
    expect(3).toBe(filledSet.put(new Platz(6, 6), 8));
    expect(4).toBe(filledSet.size());
    expect(0).toBe(emptySet.size());
    expect(5).toBe(filledSet.get(new Platz(5, 5)));
    expect(6).toBe(filledSet.get(new Platz(5, 6)));
    expect(7).toBe(filledSet.get(new Platz(6, 5)));
    expect(8).toBe(filledSet.get(new Platz(6, 6)));
    emptySet.put(Geldbetrag.parseGeldbetrag(0, 0), 0);
    emptySet.put(Geldbetrag.parseGeldbetrag(1, 1), 1);
    emptySet.put(Geldbetrag.parseGeldbetrag("1,01 €"), 2);
    expect(2).toBe(emptySet.size());
  });

  it("teste clear/contains", () => {
    expect(4).toBe(filledSet.size());
    expect(0).toBe(filledSet.get(new Platz(5, 5)));
    expect(true).toBe(filledSet.contains(new Platz(5, 5)));
    expect(true).toBe(filledSet.contains(new Platz(6, 6)));
    expect(false).toBe(filledSet.contains(new Platz(8, 0)));
    expect(0).toBe(filledSet.get(new Platz(5, 5)));
    filledSet.clear();
    expect(false).toBe(filledSet.contains(new Platz(5, 5)));
    expect(undefined).toBe(filledSet.get(new Platz(5, 5)));
    expect(0).toBe(filledSet.size());
  });

  it("teste forEach", () => {
    const set = new HashMap<Testklasse, Testklasse>();
    const test1 = new Testklasse(0);
    const test2 = new Testklasse(0);
    const test3 = new Testklasse(1);
    const test4 = new Testklasse(2);
    const test5 = new Testklasse(3);
    const test6 = new Testklasse(4);
    set.put(test1, test4);
    set.put(test2, test5);
    set.put(test3, test6);
    const arr1 = [undefined, undefined, undefined, undefined, undefined, undefined];
    const arr2 = [7, undefined, 7, undefined, 8, 8];
    expect(2).toBe(set.size());
    expect(arr1).toEqual([test1.getA(),
      test2.getA(),
      test3.getA(),
      test4.getA(),
      test5.getA(),
      test6.getA()]);
    set.forEach((key, val) => {
      key.setA(7);
      val.setA(8);
    });
    expect(arr2).toEqual([test1.getA(),
      test2.getA(),
      test3.getA(),
      test4.getA(),
      test5.getA(),
      test6.getA()]);
  });

  it("teste remove", () => {
    expect(4).toBe(filledSet.size());
    expect(0).toBe(filledSet.remove(new Platz(5, 5)));
    expect(3).toBe(filledSet.size());
    filledSet.put(new Platz(0, 0), 9);
    expect(4).toBe(filledSet.size());
    expect(1).toBe(filledSet.remove(new Platz(5, 6)));
    expect(3).toBe(filledSet.remove(new Platz(6, 6)));
    expect(undefined).toBe(filledSet.remove(new Platz(6, 6)));
    expect(2).toBe(filledSet.size());
  });
});
