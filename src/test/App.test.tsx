import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('Accounting App', () => {
  it('should render the accounting title', () => {
    render(<App />);
    expect(screen.getByText('Accounting MFE')).toBeInTheDocument();
  });

  it('should render SummaryCards component', () => {
    render(<App />);
    expect(screen.getByText('Total Amount')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Total Invoices')).toBeInTheDocument();
  });

  it('should render InvoiceForm component', () => {
    render(<App />);
    expect(screen.getByText('Add New Invoice')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Client Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
  });

  it('should render InvoiceTable component', () => {
    render(<App />);
    expect(screen.getByText('Invoice #')).toBeInTheDocument();
    expect(screen.getByText('Client')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('should display initial invoices', () => {
    render(<App />);
    // Should have at least one invoice from generated data
    const invoiceNumbers = screen.getAllByText(/INV-/);
    expect(invoiceNumbers.length).toBeGreaterThan(0);
  });

  it('should have correct layout structure', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.p-6')).toBeInTheDocument();
  });
});
