import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const useRecipes = (searchQuery: string, selectedCategory: string) => {
  return useQuery({
    queryKey: ['recipes', searchQuery, selectedCategory],
    queryFn: async () => {
      if (selectedCategory) {
        const recipes = await api.getRecipesByCategory(selectedCategory);
        if (searchQuery) {
          return recipes.filter(recipe => 
            recipe.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        return recipes;
      }
      return api.searchRecipes(searchQuery || '');
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });
};
