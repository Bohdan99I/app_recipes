import React, { useEffect, useState } from 'react';
import { Grid, Container, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, CircularProgress, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setRecipes, setLoading, setError, setCurrentPage, setSearchQuery, setSelectedCategory } from '../store/recipeSlice';
import { RecipeCard } from '../components/RecipeCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { api } from '../services/api';

export const RecipeList: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    recipes,
    loading,
    currentPage,
    itemsPerPage,
    searchQuery,
    selectedCategory 
  } = useSelector((state: RootState) => state.recipes);

  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const categoriesList = await api.getCategories();
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      dispatch(setLoading(true));
      try {
        const fetchedRecipes = await api.searchRecipes('');
        dispatch(setRecipes(fetchedRecipes));
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchInitialData();
  }, [dispatch]); 

  useEffect(() => {
    const fetchRecipes = async () => {
      dispatch(setLoading(true));
      try {
        let fetchedRecipes;
        if (selectedCategory) {
          // Отримуємо рецепти за категорією
          fetchedRecipes = await api.getRecipesByCategory(selectedCategory);
          // Якщо є пошуковий запит, фільтруємо результати
          if (searchQuery) {
            fetchedRecipes = fetchedRecipes.filter(recipe => 
              recipe.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
        } else {
          // Якщо категорія не вибрана, використовуємо пошук
          fetchedRecipes = await api.searchRecipes(searchQuery || '');
        }
        dispatch(setRecipes(fetchedRecipes));
      } catch (error) {
        dispatch(setError('Error fetching recipes'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchRecipes();
  }, [dispatch, searchQuery, selectedCategory]);

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
    dispatch(setCurrentPage(1));
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    dispatch(setSelectedCategory(event.target.value));
    dispatch(setSearchQuery('')); 
    dispatch(setCurrentPage(1));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

   const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecipes = recipes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(recipes.length / itemsPerPage);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SearchBar onSearch={handleSearch} />
      
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={categories.includes(selectedCategory) ? selectedCategory : ''}
          label="Category"
          onChange={handleCategoryChange}
          disabled={loadingCategories}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        {currentRecipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.idMeal}>
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
  );
};
