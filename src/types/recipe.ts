export interface Recipe {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string;
  strIngredients: string[];
  strMeasures: string[];
}

export interface RecipeResponse {
  meals: Recipe[];
}

export interface SelectedRecipe extends Recipe {
  quantity: number;
}
