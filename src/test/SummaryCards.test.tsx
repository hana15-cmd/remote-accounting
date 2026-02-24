import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SummaryCards from '../components/SummaryCards';

describe('SummaryCards', () => {
  it('should render all summary card titles', () => {
    render(<SummaryCards total={5000} paid={3000} pending={2000} count={10} />);
    
    expect(screen.getByText('Total Amount')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Total Invoices')).toBeInTheDocument();
  });

  it('should display formatted total amount', () => {
    render(<SummaryCards total={5000} paid={3000} pending={2000} count={10} />);
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
  });

  it('should display formatted paid amount', () => {
    render(<SummaryCards total={5000} paid={3000} pending={2000} count={10} />);
    expect(screen.getByText('$3,000.00')).toBeInTheDocument();
  });

  it('should display formatted pending amount', () => {
    render(<SummaryCards total={5000} paid={3000} pending={2000} count={10} />);
    expect(screen.getByText('$2,000.00')).toBeInTheDocument();
  });

  it('should display invoice count', () => {
    render(<SummaryCards total={5000} paid={3000} pending={2000} count={10} />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should handle zero values', () => {
    render(<SummaryCards total={0} paid={0} pending={0} count={0} />);
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should format large numbers correctly', () => {
    render(<SummaryCards total={1234567.89} paid={0} pending={0} count={0} />);
    expect(screen.getByText('$1,234,567.89')).toBeInTheDocument();
  });

  it('should render in grid layout', () => {
    const { container } = render(<SummaryCards total={0} paid={0} pending={0} count={0} />);
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });
});
