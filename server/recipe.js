// Shared boundary checks. Never accept a client-supplied owner identifier.
export class InputError extends Error {}
const fail = message => { throw new InputError(message); };
const text = (value, name, max, required = false) => {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) fail(`Invalid ${name}`);
  return value;
};
const number = (value, name, min, max, integer = false) => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) fail(`Invalid ${name}`);
  return value;
};
export function validateRecipe(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) fail('Invalid recipe');
  const id = text(input.id, 'id', 100, true);
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) fail('Invalid id');
  if (!Array.isArray(input.tags) || input.tags.length > 30) fail('Invalid tags');
  if (!Array.isArray(input.ingredients) || input.ingredients.length > 200) fail('Invalid ingredients');
  if (typeof input.isFav !== 'boolean') fail('Invalid favorite');
  const image = text(input.image ?? '', 'image', 300000);
  if (image && !/^https:\/\//i.test(image) && !/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(image)) fail('Invalid image: use HTTPS or a small PNG/JPEG/WebP image');
  return {
    id, title: text(input.title, 'title', 200, true),
    time: number(input.time, 'time', 1, 1440, true),
    level: text(input.level, 'level', 30),
    servings: number(input.servings, 'servings', 1, 100, true),
    category: text(input.category ?? '', 'category', 100),
    cuisine: text(input.cuisine ?? '', 'cuisine', 100),
    calories: input.calories === '' || input.calories == null ? '' : number(Number(input.calories), 'calories', 0, 100000),
    rating: number(input.rating, 'rating', 0, 5), isFav: input.isFav,
    tags: input.tags.map(v => text(v, 'tag', 100)),
    notes: text(input.notes ?? '', 'notes', 20000),
    ingredients: input.ingredients.map(v => {
      if (!v || typeof v !== 'object') fail('Invalid ingredient');
      return { qty: text(String(v.qty ?? ''), 'quantity', 40), unit: text(v.unit ?? '', 'unit', 40), name: text(v.name, 'ingredient', 200) };
    }),
    instructions: text(input.instructions, 'instructions', 50000, true), image,
  };
}
