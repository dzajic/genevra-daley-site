import assert from "node:assert/strict";

const listeners = new Map();
const listenable = (name) => ({
  addEventListener(type, handler) { listeners.set(`${name}:${type}`, handler); }
});

const slides = [0, 640, 1280].map((offsetLeft) => ({
  offsetLeft,
  classList: { toggle() {} },
  setAttribute() {}
}));
const previous = listenable("previous");
const next = listenable("next");
const status = { textContent: "" };
const track = {
  ...listenable("track"),
  scrollLeft: 0,
  scrollTo({ left }) { this.scrollLeft = left; }
};
const carousel = {
  ...listenable("carousel"),
  classList: { toggle() {} },
  querySelector(selector) {
    return {
      ".carousel-track": track,
      ".gallery-control-prev": previous,
      ".gallery-control-next": next,
      "[data-carousel-status]": status
    }[selector] || null;
  },
  querySelectorAll(selector) { return selector === "[data-carousel-slide]" ? slides : []; }
};

globalThis.document = {
  querySelector() { return null; },
  querySelectorAll(selector) { return selector === "[data-carousel]" ? [carousel] : []; }
};
globalThis.window = { clearTimeout, setTimeout };

await import(`../src/assets/site.js?test=${Date.now()}`);

listeners.get("next:click")();
assert.equal(track.scrollLeft, 640, "Next control advances one artwork");

listeners.get("previous:click")();
assert.equal(track.scrollLeft, 0, "Previous control returns one artwork");

listeners.get("previous:click")();
assert.equal(track.scrollLeft, 1280, "Previous control loops from first to last");

let prevented = false;
listeners.get("carousel:keydown")({ key: "ArrowRight", preventDefault() { prevented = true; } });
assert.equal(track.scrollLeft, 0, "Right arrow loops from last to first");
assert.equal(prevented, true, "Keyboard navigation prevents page scrolling");
assert.equal(status.textContent, "Artwork 1 of 3", "Carousel announces its active artwork");

console.log("Carousel controls, looping, keyboard navigation, and status announcements pass.");
