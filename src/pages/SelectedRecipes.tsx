import React, { useMemo, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { removeSelectedRecipe, updateRecipeQuantity } from '../store/recipeSlice';
import { Recipe } from '../types/recipe';

interface Ingredient {
  name: string;
  measures: string[];
}

export const SelectedRecipes: React.FC = () => {
  const dispatch = useDispatch();
  const selectedRecipes = useSelector((state: RootState) => state.recipes.selectedRecipes);
  const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);

  const handleRemoveRecipe = (id: string) => {
    setRecipeToDelete(id);
  };

  const confirmDelete = () => {
    if (recipeToDelete) {
      dispatch(removeSelectedRecipe(recipeToDelete));
      setRecipeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setRecipeToDelete(null);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateRecipeQuantity({ id, quantity }));
    }
  };

  const calculateTotalIngredients = useCallback(() => {
    const ingredientsMap = new Map<string, Ingredient>();

    selectedRecipes.forEach((recipe) => {
      let i = 1;
      while (recipe[`strIngredient${i}` as keyof Recipe]) {
        const ingredient = recipe[`strIngredient${i}` as keyof Recipe] as string;
        const measure = recipe[`strMeasure${i}` as keyof Recipe] as string;

        if (ingredient?.trim()) {
          const ingredientKey = ingredient.toLowerCase();
          if (!ingredientsMap.has(ingredientKey)) {
            ingredientsMap.set(ingredientKey, {
              name: ingredient,
              measures: [],
            });
          }
          
          const currentIngredient = ingredientsMap.get(ingredientKey)!;
          const measureWithQuantity = recipe.quantity > 1 
            ? `${measure} (x${recipe.quantity})`
            : measure;
          currentIngredient.measures.push(measureWithQuantity);
        }
        i++;
      }
    });

    return Array.from(ingredientsMap.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedRecipes]);

  const totalIngredients = useMemo(() => calculateTotalIngredients(), [calculateTotalIngredients]);

  if (selectedRecipes.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          No recipes selected
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Selected Recipes
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recipe List
            </Typography>
            {selectedRecipes.map((recipe) => (
              <Box
                key={recipe.idMeal}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">{recipe.strMeal}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {recipe.strCategory}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleUpdateQuantity(recipe.idMeal, recipe.quantity - 1)}
                  >
                    <Remove />
                  </IconButton>
                  <Typography>{recipe.quantity}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleUpdateQuantity(recipe.idMeal, recipe.quantity + 1)}
                  >
                    <Add />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveRecipe(recipe.idMeal)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Total Ingredients Needed
            </Typography>
            <List>
              {totalIngredients.map((ingredient, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={ingredient.name}
                    secondary={ingredient.measures.join(', ')}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cooking Instructions
            </Typography>
            {selectedRecipes.map((recipe, index) => (
              <Box key={recipe.idMeal} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {index + 1}. {recipe.strMeal} (x{recipe.quantity})
                </Typography>
                <Typography variant="body1" component="div" sx={{ pl: 3 }}>
                  {recipe.strInstructions?.split('\r\n').map((instruction, i) => (
                    instruction && (
                      <Box key={i} sx={{ mb: 1 }}>
                        • {instruction}
                      </Box>
                    )
                  )) || 'No instructions available'}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={!!recipeToDelete}
        onClose={cancelDelete}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove this recipe from your selection?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
