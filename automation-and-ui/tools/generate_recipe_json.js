
#!/usr/bin/env node
const fs = require('fs');
const INPUT = process.env.INPUT_JSON || 'recipe.input.json';
const OUTPUT = process.env.OUTPUT_JSON || 'generated_recipe.json';
function slugify(s){ return (s||'').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/\((?:.|
)*?\)/g,' ').replace(/[&]/g,' and ').replace(/[^\w\s-]/g,' ').replace(/\s+/g,' ').trim().replace(/[\s_]+/g,'-').replace(/-+/g,'-'); }
function keyFromItem(item){ const raw=(item||'').trim(); let s=raw.replace(/\((?:.|
)*?\)/g,' '); const DROP=['fresh','uncooked','raw']; s=s.replace(new RegExp('^\s*(' + DROP.join('|') + ')\b\s*','i'),''); return slugify(s); }
const raw = fs.readFileSync(INPUT,'utf8');
const recipe = JSON.parse(raw);
let ingredients=[], instructions=[], tags=Array.isArray(recipe.tags)?recipe.tags:[];
if(Array.isArray(recipe.components)){
  const ing = recipe.components.find(c=>c.component_name==='Ingredients');
  const inst = recipe.components.find(c=>c.component_name==='Instructions');
  ingredients = ing?.ingredients || [];
  instructions = Array.isArray(inst?.instructions) ? inst.instructions : (inst||[]);
}else{
  ingredients = recipe.ingredients || [];
  instructions = recipe.instructions || [];
}
let ingredientTags = Array.isArray(recipe.ingredientTags)?recipe.ingredientTags:(()=>{const s=new Set(ingredients.map(i=>i?.key||keyFromItem(i?.item)).filter(Boolean)); return Array.from(s).sort();})();
let ingredientAtoms = Array.isArray(recipe.ingredientAtoms)?recipe.ingredientAtoms:(()=>{const s=new Set(); ingredientTags.forEach(k=>k.split('-').forEach(tok=>tok&&s.add(tok))); return Array.from(s).sort();})();
const normalized = { id:Number.isFinite(+recipe.id)?+recipe.id:null, name:recipe.name, servings:(Number.isFinite(+recipe.servings)&&+recipe.servings>0)?+recipe.servings:null, tags, components:[ {component_name:'Ingredients', ingredients}, {component_name:'Instructions', instructions} ], ingredientTags, ingredientAtoms };
fs.writeFileSync(OUTPUT, JSON.stringify(normalized,null,2),'utf8');
console.log(`Wrote ${OUTPUT}`);
