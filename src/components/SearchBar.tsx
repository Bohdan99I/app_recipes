import React, { useState, useMemo } from 'react';
import { Box, TextField, IconButton, InputAdornment } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { debounce } from 'lodash';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      onSearch(query);
    }, 500),
    [onSearch]
  );

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    if (!value.trim()) {
      onSearch('');
    } else {
      debouncedSearch(value.trim());
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter dish name..."
        value={searchValue}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {searchValue && (
                <IconButton onClick={handleClear} size="small">
                  <Clear />
                </IconButton>
              )}
              <IconButton size="small">
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};
