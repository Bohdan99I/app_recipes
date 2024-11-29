import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe, SelectedRecipe } from '../types/recipe';

interface RecipeState {
  recipes: Recipe[];
  selectedRecipes: SelectedRecipe[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
  selectedCategory: string;
}

const initialState: RecipeState = {
  recipes: [],
  selectedRecipes: [],
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 8,
  searchQuery: '',
  selectedCategory: '',
};

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    addSelectedRecipe: (state, action: PayloadAction<Recipe>) => {
      const existingRecipe = state.selectedRecipes.find(
        recipe => recipe.idMeal === action.payload.idMeal
      );
      if (existingRecipe) {
        existingRecipe.quantity += 1;
      } else {
        state.selectedRecipes.push({ ...action.payload, quantity: 1 });
      }
    },
    removeSelectedRecipe: (state, action: PayloadAction<string>) => {
      state.selectedRecipes = state.selectedRecipes.filter(
        recipe => recipe.idMeal !== action.payload
      );
    },
    updateRecipeQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const recipe = state.selectedRecipes.find(r => r.idMeal === action.payload.id);
      if (recipe) {
        recipe.quantity = action.payload.quantity;
      }
    },
  },
});

export const {
  setRecipes,
  setLoading,
  setError,
  setCurrentPage,
  setSearchQuery,
  setSelectedCategory,
  addSelectedRecipe,
  removeSelectedRecipe,
  updateRecipeQuantity,
} = recipeSlice.actions;

export default recipeSlice.reducer;
