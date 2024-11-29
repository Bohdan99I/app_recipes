import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 7; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 6; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, my: 3 }}>
      <IconButton 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft />
      </IconButton>
      
      {renderPageNumbers().map((page, index) => (
        <Box
          key={index}
          sx={{
            cursor: page === '...' ? 'default' : 'pointer',
            padding: '8px 12px',
            borderRadius: '4px',
            backgroundColor: currentPage === page ? 'primary.main' : 'transparent',
            color: currentPage === page ? 'white' : 'text.primary',
            '&:hover': {
              backgroundColor: page === '...' ? 'transparent' : 'action.hover',
            },
          }}
          onClick={() => {
            if (page !== '...') {
              onPageChange(page as number);
            }
          }}
        >
          <Typography variant="body1">
            {page}
          </Typography>
        </Box>
      ))}

      <IconButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};
