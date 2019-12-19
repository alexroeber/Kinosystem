import {Uhrzeit} from "./Uhrzeit";

describe("Uhrzeit", () => {
  it("teste Konstruktor", () => {
    const u = new Uhrzeit(15, 13);
    expect(u.getStunden()).toBe(15);
    expect(u.getMinuten()).toBe(13);
  });

  it("teste compareTo", () => {
    const u1 = new Uhrzeit(12, 0);
    const u2 = new Uhrzeit(15, 20);
    const u3 = new Uhrzeit(15, 20);
    expect(u1.compareTo(u2)).toBeLessThan(0);
    expect(u2.compareTo(u1)).toBeGreaterThan(0);
    expect(u1.compareTo(u1)).toBe(0);
    expect(u2.compareTo(u3)).toBe(0);
  });

  it("teste equals hashCode", () => {
    const u1 = new Uhrzeit(20, 15);
    const u2 = new Uhrzeit(20, 15);
    const u3 = new Uhrzeit(20, 17);
    const u4 = new Uhrzeit(21, 15);
    expect(u1.equals(u2)).toBe(true);
    expect(u1.hashCode()).toBe(u2.hashCode());
    expect(u1.equals(u3)).toBe(false);
    expect(u1.equals(u4)).toBe(false);
  });
});
