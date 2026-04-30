export interface ParsedRecipe {
  title?: string;
  ingredients?: string[];
  instructions?: string[];
  servings?: number;
  warnings: string[];
}

export function parseRecipeText(text: string): ParsedRecipe {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
  const result: ParsedRecipe = {
    warnings: []
  };

  if (lines.length === 0) {
    result.warnings.push('The pasted text is empty.');
    return result;
  }

  // Heuristic: First line might be the title if it's not a common keyword
  const firstLine = lines[0];
  const keywords = ['ingredients', 'instructions', 'steps', 'directions', 'servings', 'notes', 'prep', 'cook'];
  if (!keywords.some(k => firstLine.toLowerCase().includes(k))) {
    result.title = firstLine;
  } else {
    result.warnings.push('Title could not be clearly identified. Please add it manually.');
  }

  // Finding sections
  let ingredientStartIndex = -1;
  let instructionStartIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const lowerLine = lines[i].toLowerCase();
    if (ingredientStartIndex === -1 && (lowerLine.startsWith('ingredients') || lowerLine === 'what you need')) {
      ingredientStartIndex = i;
    }
    if (instructionStartIndex === -1 && (lowerLine.startsWith('instructions') || lowerLine.startsWith('directions') || lowerLine.startsWith('steps') || lowerLine === 'method')) {
      instructionStartIndex = i;
    }
  }

  // Extract Ingredients
  if (ingredientStartIndex !== -1) {
    const ingredients: string[] = [];
    const endSearch = instructionStartIndex !== -1 ? instructionStartIndex : lines.length;
    for (let i = ingredientStartIndex + 1; i < endSearch; i++) {
      // Basic check: avoid lines that look like other headers or are too short
      if (keywords.some(k => lines[i].toLowerCase().includes(k) && lines[i].length < 20)) break;
      ingredients.push(lines[i]);
    }
    if (ingredients.length > 0) {
      result.ingredients = ingredients;
    } else {
      result.warnings.push('Found "Ingredients" header but no items. Please add them manually.');
    }
  } else {
    result.warnings.push('Ingredients section not found. Please review the text.');
  }

  // Extract Instructions
  if (instructionStartIndex !== -1) {
    const instructions: string[] = [];
    for (let i = instructionStartIndex + 1; i < lines.length; i++) {
      if (keywords.some(k => lines[i].toLowerCase().includes(k) && lines[i].length < 20 && !lines[i].toLowerCase().startsWith('step'))) break;
      instructions.push(lines[i]);
    }
    if (instructions.length > 0) {
      result.instructions = instructions;
    } else {
      result.warnings.push('Found "Instructions" header but no steps. Please add them manually.');
    }
  } else {
    result.warnings.push('Instructions section not found. Please review the text.');
  }

  // Extract Servings (very basic)
  const servingsLine = lines.find(line => line.toLowerCase().includes('servings'));
  if (servingsLine) {
    const match = servingsLine.match(/\d+/);
    if (match) {
      result.servings = parseInt(match[0]);
    }
  }
  
  if (!result.servings) {
    result.warnings.push('Serving size not detected. Add manually if needed.');
  }

  return result;
}
