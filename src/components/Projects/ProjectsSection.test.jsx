import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../context/ThemeContext';
import ProjectsSection from './ProjectsSection';

const mockProjects = [
  {
    title: 'Test Project',
    details: 'Test Description',
    time: '2024',
    skills: 'React · JavaScript',
    project_link: 'https://example.com'
  }
];

describe('ProjectsSection', () => {
  it('renders projects correctly', () => {
    render(
      <ThemeProvider>
        <ProjectsSection projects={mockProjects} />
      </ThemeProvider>
    );

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
}); 