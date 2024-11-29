import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addSelectedRecipe } from '../store/recipeSlice';
import { Recipe } from '../types/recipe';
import { api } from '../services/api';

export const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      try {
        const recipeData = await api.getRecipeById(id);
        setRecipe(recipeData);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  const ingredients = Array.from({ length: 20 }, (_, i) => ({
    ingredient: recipe[`strIngredient${i + 1}` as keyof Recipe] as string,
    measure: recipe[`strMeasure${i + 1}` as keyof Recipe] as string,
  })).filter(({ ingredient, measure }) => ingredient && ingredient.trim());

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {recipe.strMeal}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Category: {recipe.strCategory}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Origin: {recipe.strArea}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              dispatch(addSelectedRecipe(recipe));
              setShowSnackbar(true);
            }}
            sx={{ mt: 2, mb: 4 }}
          >
            Add to Selected Recipes
          </Button>

          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Ingredients
            </Typography>
            <List>
              {ingredients.map(({ ingredient, measure }, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${ingredient} - ${measure}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Instructions
            </Typography>
            <Typography variant="body1" component="div">
              {recipe.strInstructions.split('\r\n').map((instruction, index) => (
                instruction && (
                  <Box key={index} sx={{ mb: 1 }}>
                    {instruction}
                  </Box>
                )
              ))}
            </Typography>
          </Paper>
        </Grid>

        {recipe.strYoutube && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Video Tutorial
              </Typography>
              <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={recipe.strYoutube.replace('watch?v=', 'embed/')}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                  title="Recipe Video"
                  allowFullScreen
                />
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={2000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="success">
          Recipe added to selected recipes!
        </Alert>
      </Snackbar>
    </Container>
  );
};
