import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { RecipeList } from './pages/RecipeList';
import { RecipeDetail } from './pages/RecipeDetail';
import { SelectedRecipes } from './pages/SelectedRecipes';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchQuery, setSelectedCategory, setCurrentPage } from './store/recipeSlice';

const AppContent: React.FC = () => {
  const dispatch = useDispatch();

  const handleLogoClick = () => {
    dispatch(setSearchQuery(''));
    dispatch(setSelectedCategory(''));
    dispatch(setCurrentPage(1));
  };

  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              onClick={handleLogoClick}
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                flexGrow: 1,
              }}
            >
              Recipe App
            </Typography>
            <Button
              component={RouterLink}
              to="/"
              color="inherit"
              onClick={handleLogoClick}
              sx={{ mr: 2 }}
            >
              Recipes
            </Button>
            <Button
              component={RouterLink}
              to="/selected"
              color="inherit"
            >
              Selected Recipes
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Routes>
        <Route path="/" element={<RecipeList />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/selected" element={<SelectedRecipes />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;
