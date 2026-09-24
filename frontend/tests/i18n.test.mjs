import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createInstance } from "i18next";

const read = (name) => JSON.parse(readFileSync(new URL(`../src/shared/i18n/${name}.json`, import.meta.url)));
const en = read("en");
const ru = read("ru");

test("both dictionaries cover the same messages and preserve interpolation parameters", () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(ru).sort());
  for (const key of Object.keys(en)) {
    assert.ok(en[key].trim() && ru[key].trim(), key);
    const parameters = (text) => [...text.matchAll(/{{(\w+)}}/g)].map((match) => match[1]).sort();
    assert.deepEqual(parameters(en[key]), parameters(ru[key]), key);
  }
});

test("language switching translates controls and Russian plural forms", async () => {
  const i18n = createInstance();
  await i18n.init({
    resources: { en: { translation: en }, ru: { translation: ru } },
    lng: "en",
    fallbackLng: "en",
    keySeparator: false,
    nsSeparator: false,
  });
  assert.equal(i18n.t("Run agent"), "Run agent");
  assert.equal(i18n.t("warningCount", { count: 2 }), "2 warnings");
  await i18n.changeLanguage("ru");
  assert.equal(i18n.t("Run agent"), "Запустить агента");
  for (const [count, word] of [
    [1, "предупреждение"],
    [2, "предупреждения"],
    [5, "предупреждений"],
    [11, "предупреждений"],
    [21, "предупреждение"],
  ]) {
    assert.equal(i18n.t("warningCount", { count }), `${count} ${word}`);
  }
});
