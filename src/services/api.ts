import axios from 'axios';
import { Recipe, RecipeResponse } from '../types/recipe';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const api = {
  async searchRecipes(query: string): Promise<Recipe[]> {
    try {
      const response = await axios.get<RecipeResponse>(`${API_BASE_URL}/search.php?s=${query}`);
      return response.data.meals || [];
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw new Error('Failed to search recipes');
    }
  },

  async getRecipeById(id: string): Promise<Recipe | null> {
    try {
      const response = await axios.get<RecipeResponse>(`${API_BASE_URL}/lookup.php?i=${id}`);
      return response.data.meals?.[0] || null;
    } catch (error) {
      console.error('Error getting recipe by id:', error);
      throw new Error('Failed to get recipe');
    }
  },

  async getRecipesByCategory(category: string): Promise<Recipe[]> {
    try {
      const response = await axios.get<RecipeResponse>(`${API_BASE_URL}/filter.php?c=${category}`);
      return response.data.meals || [];
    } catch (error) {
      console.error('Error getting recipes by category:', error);
      throw new Error('Failed to get recipes by category');
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/list.php?c=list`);
      return response.data.meals.map((cat: { strCategory: string }) => cat.strCategory);
    } catch (error) {
      console.error('Error getting categories:', error);
      throw new Error('Failed to get categories');
    }
  },
};
