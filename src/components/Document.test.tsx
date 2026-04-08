import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DocumentPreview } from './Document';
import { getDefaultObituaryData } from '../types';

describe('DocumentPreview', () => {
  it('renders correctly in Javanese (default)', () => {
    const data = getDefaultObituaryData();
    render(<DocumentPreview data={data} />);
    
    // Check for Javanese title
    expect(screen.getByText('PAWARTOS LELAYU')).toBeInTheDocument();
    // Check for Javanese labels
    expect(screen.getByText(/Katur Dhumateng/i)).toBeInTheDocument();
  });

  it('renders correctly in Indonesian when language is changed', () => {
    const data = {
      ...getDefaultObituaryData(),
      language: 'id' as const
    };
    render(<DocumentPreview data={data} />);
    
    // Check for Indonesian title
    expect(screen.getByText('KABAR DUKA')).toBeInTheDocument();
    // Check for Indonesian labels
    expect(screen.getByText(/Kepada Yth./i)).toBeInTheDocument();
  });

  it('does not show parentheses when family relation is empty', () => {
    const data = {
      ...getDefaultObituaryData(),
      keluarga: [
        { id: '1', name: 'Budi', relation: '' }
      ]
    };
    render(<DocumentPreview data={data} />);
    
    // Should see the name
    expect(screen.getByText(/1. Budi/i)).toBeInTheDocument();
    // Should NOT see any empty parentheses "()"
    const familySection = screen.getByText(/Ingkang nandang sungkowo/i).parentElement;
    expect(familySection).not.toHaveTextContent('()');
  });

  it('shows parentheses when family relation is provided', () => {
    const data = {
      ...getDefaultObituaryData(),
      keluarga: [
        { id: '1', name: 'Budi', relation: 'Anak' }
      ]
    };
    render(<DocumentPreview data={data} />);
    
    expect(screen.getByText(/1. Budi/i)).toBeInTheDocument();
    expect(screen.getByText(/(Anak)/i)).toBeInTheDocument();
  });
});
