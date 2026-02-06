#!/usr/bin/env node
const fs = require('fs');
const INPUT = process.env.INPUT_JSON || 'recipe.input.json';
const OUTPUT = process.env.OUTPUT_JSON || 'generated_recipe.json';

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function keyFromItem(item) {
  const raw = (item || '').trim();
  let s = raw.replace(/\((?:.|\n)*?\)/g, ' ');
  const DROP = ['fresh', 'uncooked', 'raw'];
  s = s.replace(new RegExp('^\\s*(' + DROP.join('|') + ')\\b\\s*', 'i'), '');
  return slugify(s);
}

try {
  const raw = fs.readFileSync(INPUT, 'utf8');
  const recipe = JSON.parse(raw);

  let ingredients = [],
      instructions = [],
      tags = Array.isArray(recipe.tags) ? recipe.tags : [];

  if (Array.isArray(recipe.components)) {
    const ing = recipe.components.find(c => c.component_name === 'Ingredients');
    const inst = recipe.components.find(c => c.component_name === 'Instructions');
    ingredients = Array.isArray(ing?.ingredients) ? ing.ingredients : [];
    instructions = Array.isArray(inst?.instructions) ? inst.instructions : [];
  } else {
    ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];
  }

  let ingredientTags = Array.isArray(recipe.ingredientTags)
    ? recipe.ingredientTags
    : (() => {
        const s = new Set(ingredients.map(i => i?.key || keyFromItem(i?.item)).filter(Boolean));
        return Array.from(s).sort();
      })();

  let ingredientAtoms = Array.isArray(recipe.ingredientAtoms)
    ? recipe.ingredientAtoms
    : (() => {
        const s = new Set();
        ingredientTags.forEach(k => k.split('-').forEach(tok => tok && s.add(tok)));
        return Array.from(s).sort();
      })();

  const normalized = {
    id: Number.isFinite(+recipe.id) ? +recipe.id : Date.now(),
    name: recipe.name || "Untitled Recipe",
    servings: (Number.isFinite(+recipe.servings) && +recipe.servings > 0) ? +recipe.servings : 1,
    tags,
    components: [
      { component_name: 'Ingredients', ingredients },
      { component_name: 'Instructions', instructions }
    ],
    ingredientTags,
    ingredientAtoms
  };

  try {
    fs.writeFileSync(OUTPUT, JSON.stringify(normalized, null, 2), 'utf8');
    console.log(`Wrote ${OUTPUT}`);
  } catch (e) {
    console.error("Failed to write output file:", e);
    process.exit(1);
  }
} catch (e) {
  console.error("Error:", e);
  process.exit(1);
}
#!/usr/bin/env node
const fs = require('fs');
const INPUT = process.env.INPUT_JSON || 'recipe.input.json';
const OUTPUT = process.env.OUTPUT_JSON || 'generated_recipe.json';

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function keyFromItem(item) {
  const raw = (item || '').trim();
  let s = raw.replace(/\((?:.|\n)*?\)/g, ' ');
  const DROP = ['fresh', 'uncooked', 'raw'];
  s = s.replace(new RegExp('^\\s*(' + DROP.join('|') + ')\\b\\s*', 'i'), '');
  return slugify(s);
}

try {
  const raw = fs.readFileSync(INPUT, 'utf8');
  const recipe = JSON.parse(raw);

  let ingredients = [],
      instructions = [],
      tags = Array.isArray(recipe.tags) ? recipe.tags : [];

  if (Array.isArray(recipe.components)) {
    const ing = recipe.components.find(c => c.component_name === 'Ingredients');
    const inst = recipe.components.find(c => c.component_name === 'Instructions');
    ingredients = Array.isArray(ing?.ingredients) ? ing.ingredients : [];
    instructions = Array.isArray(inst?.instructions) ? inst.instructions : [];
  } else {
    ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];
  }

  let ingredientTags = Array.isArray(recipe.ingredientTags)
    ? recipe.ingredientTags
    : (() => {
        const s = new Set(ingredients.map(i => i?.key || keyFromItem(i?.item)).filter(Boolean));
        return Array.from(s).sort();
      })();

  let ingredientAtoms = Array.isArray(recipe.ingredientAtoms)
    ? recipe.ingredientAtoms
    : (() => {
        const s = new Set();
        ingredientTags.forEach(k => k.split('-').forEach(tok => tok && s.add(tok)));
        return Array.from(s).sort();
      })();

  const normalized = {
    id: Number.isFinite(+recipe.id) ? +recipe.id : Date.now(),
    name: recipe.name || "Untitled Recipe",
    servings: (Number.isFinite(+recipe.servings) && +recipe.servings > 0) ? +recipe.servings : 1,
    tags,
    components: [
      { component_name: 'Ingredients', ingredients },
      { component_name: 'Instructions', instructions }
    ],
    ingredientTags,
    ingredientAtoms
  };

  try {
    fs.writeFileSync(OUTPUT, JSON.stringify(normalized, null, 2), 'utf8');
    console.log(`Wrote ${OUTPUT}`);
  } catch (e) {
    console.error("Failed to write output file:", e);
    process.exit(1);
  }
} catch (e) {
  console.error("Error:", e);
  process.exit(1);
}
