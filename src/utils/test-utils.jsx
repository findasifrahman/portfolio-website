import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeContext';
import { DataProvider } from '../context/DataContext';
import { BrowserRouter } from 'react-router-dom';

const AllTheProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <DataProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </DataProvider>
    </ThemeProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render }; 