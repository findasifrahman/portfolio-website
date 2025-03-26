import React from 'react';
import { render, screen } from '../../utils/test-utils';
import HeroSection from './HeroSection';

describe('HeroSection', () => {
  it('renders hero content correctly', () => {
    render(<HeroSection />);
    
    expect(screen.getByText('Md. Asifur Rahman')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer & Embedded System Designer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view projects/i })).toBeInTheDocument();
  });
}); 