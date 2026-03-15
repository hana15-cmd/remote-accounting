import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SummaryCards from '../components/SummaryCards';

describe('SummaryCards', () => {
  it('should render all summary card titles', () => {
    render(<SummaryCards total={5000} paid={3000} pending={2000} count={10} paidCount={6} pendingCount={4} />);
    
    expect(screen.getByText('Total Invoices')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('should display formatted total amount', () => {
    render(<SummaryCards total={5000} paid={3000} pending={2000} count={10} paidCount={6} pendingCount={4} />);
    expect(screen.getByText('$5,000')).toBeInTheDocument();
  });

  it('should display formatted paid amount', () => {
    render(<SummaryCards total={5000} paid={3000} pending={2000} count={10} paidCount={6} pendingCount={4} />);
    expect(screen.getByText('$3,000')).toBeInTheDocument();
  });

  it('should display formatted pending amount', () => {
    render(<SummaryCards total={5000} paid={3000} pending={2000} count={10} paidCount={6} pendingCount={4} />);
    expect(screen.getByText('$2,000')).toBeInTheDocument();
  });

  it('should display invoice count', () => {
    render(<SummaryCards total={5000} paid={3000} pending={2000} count={10} paidCount={6} pendingCount={4} />);
    expect(screen.getByText('10 invoices')).toBeInTheDocument();
  });

  it('should handle zero values', () => {
    render(<SummaryCards total={0} paid={0} pending={0} count={0} paidCount={0} pendingCount={0} />);
    const amounts = screen.getAllByText('$0');
    expect(amounts.length).toBeGreaterThan(0);
  });

  it('should format large numbers correctly', () => {
    render(<SummaryCards total={1234567} paid={0} pending={0} count={0} paidCount={0} pendingCount={0} />);
    expect(screen.getByText('$1,234,567')).toBeInTheDocument();
  });

  it('should render in grid layout', () => {
    const { container } = render(<SummaryCards total={0} paid={0} pending={0} count={0} paidCount={0} pendingCount={0} />);
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });
});
