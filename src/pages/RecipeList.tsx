import React, { useEffect } from 'react';
import { Grid, Container, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, CircularProgress, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setCurrentPage, setSearchQuery, setSelectedCategory } from '../store/recipeSlice';
import { RecipeCard } from '../components/RecipeCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { useRecipes, useCategories } from '../hooks/useRecipes';
import { useSearchParams } from 'react-router-dom';

export const RecipeList: React.FC = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    currentPage,
    itemsPerPage,
    searchQuery,
    selectedCategory 
  } = useSelector((state: RootState) => state.recipes);

  const { 
    data: recipes = [], 
    isLoading: recipesLoading,
    error: recipesError 
  } = useRecipes(searchQuery, selectedCategory);

  const { 
    data: categories = [],
    isLoading: categoriesLoading
  } = useCategories();

  // Синхронізація URL параметрів зі станом Redux при першому завантаженні
  useEffect(() => {
    const urlPage = searchParams.get('page');
    const urlQuery = searchParams.get('query');
    const urlCategory = searchParams.get('category');

    if (urlPage) dispatch(setCurrentPage(Number(urlPage)));
    if (urlQuery) dispatch(setSearchQuery(urlQuery));
    if (urlCategory) dispatch(setSelectedCategory(urlCategory));
  }, []);

  // Оновлення URL параметрів при зміні стану
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (searchQuery) params.set('query', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  }, [currentPage, searchQuery, selectedCategory, setSearchParams]);

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

  if (recipesError) {
    return (
      <Container>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          Error loading recipes. Please try again later.
        </Box>
      </Container>
    );
  }

  if (recipesLoading || categoriesLoading) {
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
          disabled={categoriesLoading}
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
