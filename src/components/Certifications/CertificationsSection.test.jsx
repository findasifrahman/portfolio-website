import React from 'react';
import { render, screen } from '../../utils/test-utils';
import CertificationsSection from './CertificationsSection';

const mockCertifications = [
  {
    title: 'Advanced Digital Hardware Design',
    issuer: 'FEDEVEL',
    issue_date: 'Mar 2025',
    credential_url: 'https://example.com'
  }
];

describe('CertificationsSection', () => {
  it('renders certification cards correctly', () => {
    render(<CertificationsSection certifications={mockCertifications} />);
    
    expect(screen.getByText('Advanced Digital Hardware Design')).toBeInTheDocument();
    expect(screen.getByText('FEDEVEL')).toBeInTheDocument();
    expect(screen.getByText('Mar 2025')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com');
  });
}); 