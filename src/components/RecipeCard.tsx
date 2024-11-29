import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { Recipe } from '../types/recipe';
import { useDispatch } from 'react-redux';
import { addSelectedRecipe } from '../store/recipeSlice';
import { useNavigate } from 'react-router-dom';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const handleAddToSelected = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addSelectedRecipe(recipe));
    setShowSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <>
      <Card 
        sx={{ 
          maxWidth: 345, 
          cursor: 'pointer',
          transition: '0.3s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: 3,
          }
        }}
        onClick={() => navigate(`/recipe/${recipe.idMeal}`)}
      >
        <CardMedia
          component="img"
          height="194"
          image={recipe.strMealThumb}
          alt={recipe.strMeal}
        />
        <CardContent>
          <Typography variant="h6" component="div" noWrap>
            {recipe.strMeal}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Category: {recipe.strCategory}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Origin: {recipe.strArea}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddToSelected}
            sx={{ mt: 2 }}
          >
            Add to Selected
          </Button>
        </CardContent>
      </Card>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {recipe.strMeal} added to selected recipes!
        </Alert>
      </Snackbar>
    </>
  );
};
