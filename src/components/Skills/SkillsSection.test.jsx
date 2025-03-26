import React from 'react';
import { render, screen } from '../../utils/test-utils';
import SkillsSection from './SkillsSection';

const mockSkills = {
  'Hardware Design': ['FPGA', 'PCB Design'],
  'Programming': ['Python', 'JavaScript']
};

describe('SkillsSection', () => {
  it('renders skills categories and items', () => {
    render(<SkillsSection categorizedSkills={mockSkills} />);
    
    expect(screen.getByText('Hardware Design')).toBeInTheDocument();
    expect(screen.getByText('FPGA')).toBeInTheDocument();
    expect(screen.getByText('Programming')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
  });
}); 