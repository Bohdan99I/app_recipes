import React, { useState } from 'react';
import { Box, TextField, IconButton, InputAdornment } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);  
    if (!event.target.value.trim()) {
      onSearch('');
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Введіть назву страви..."
        value={searchValue}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {searchValue && (
                <IconButton onClick={handleClear} size="small">
                  <Clear />
                </IconButton>
              )}
              <IconButton onClick={handleSearch} size="small">
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};
