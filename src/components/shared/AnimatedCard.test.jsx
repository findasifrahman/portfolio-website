import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnimatedCard from './AnimatedCard';

describe('AnimatedCard', () => {
  it('renders children content', () => {
    render(
      <AnimatedCard>
        <div>Test Content</div>
      </AnimatedCard>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies hover styles', async () => {
    const { container } = render(
      <AnimatedCard>
        <div>Test Content</div>
      </AnimatedCard>
    );
    
    const card = container.firstChild;
    await userEvent.hover(card);
    
    // Check if transform scale is applied
    expect(card).toHaveStyle('transform: scale(1.02)');
  });
}); 