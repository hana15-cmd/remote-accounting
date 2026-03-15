import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InvoiceTable from '../components/InvoiceTable';
import type { Invoice } from '../types/invoice';

const mockInvoices: Invoice[] = [
  {
    id: 1,
    invoiceNumber: 'INV-001',
    client: 'Test Client 1',
    amount: 1000,
    status: 'Paid',
    date: '2026-02-01',
  },
  {
    id: 2,
    invoiceNumber: 'INV-002',
    client: 'Test Client 2',
    amount: 2000,
    status: 'Pending',
    date: '2026-02-15',
  },
];

describe('InvoiceTable', () => {
  it('should render table headers', () => {
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    
    render(
      <InvoiceTable
        invoices={mockInvoices}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    expect(screen.getByText('Invoice #')).toBeInTheDocument();
    expect(screen.getByText('Client')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('should render all invoices', () => {
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    
    render(
      <InvoiceTable
        invoices={mockInvoices}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    expect(screen.getByText('INV-001')).toBeInTheDocument();
    expect(screen.getByText('Test Client 1')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
    
    expect(screen.getByText('INV-002')).toBeInTheDocument();
    expect(screen.getByText('Test Client 2')).toBeInTheDocument();
    expect(screen.getByText('$2,000')).toBeInTheDocument();
  });

  it('should render status select for each invoice', () => {
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    
    render(
      <InvoiceTable
        invoices={mockInvoices}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(2);
  });

  it('should apply green styling to paid status', () => {
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    
    const paidInvoice: Invoice[] = [
      {
        id: 1,
        invoiceNumber: 'INV-001',
        client: 'Test',
        amount: 1000,
        status: 'Paid',
        date: '2026-02-01',
      },
    ];
    
    render(
      <InvoiceTable
        invoices={paidInvoice}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('bg-green-900', 'border-green-500', 'text-green-400');
  });

  it('should apply yellow styling to pending status', () => {
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    
    const pendingInvoice: Invoice[] = [
      {
        id: 2,
        invoiceNumber: 'INV-002',
        client: 'Test',
        amount: 2000,
        status: 'Pending',
        date: '2026-02-15',
      },
    ];
    
    render(
      <InvoiceTable
        invoices={pendingInvoice}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('bg-yellow-900', 'border-yellow-500', 'text-yellow-400');
  });

  it('should call onUpdate when status is changed', async () => {
    const user = userEvent.setup();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    
    render(
      <InvoiceTable
        invoices={mockInvoices}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], 'Pending');
    
    expect(mockOnUpdate).toHaveBeenCalledWith(1, 'status', 'Pending');
  });

  it('should render delete button for each invoice', () => {
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    
    render(
      <InvoiceTable
        invoices={mockInvoices}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    
    render(
      <InvoiceTable
        invoices={mockInvoices}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);
    
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('should render empty table when no invoices', () => {
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    
    render(
      <InvoiceTable
        invoices={[]}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    expect(screen.getByText('Invoice #')).toBeInTheDocument();
    const tbody = screen.getByRole('table').querySelector('tbody');
    expect(tbody?.children).toHaveLength(0);
  });

  it('should format amounts with locale string', () => {
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    
    const largeAmountInvoice: Invoice[] = [
      {
        id: 1,
        invoiceNumber: 'INV-001',
        client: 'Test',
        amount: 1234567,
        status: 'Paid',
        date: '2026-02-01',
      },
    ];
    
    render(
      <InvoiceTable
        invoices={largeAmountInvoice}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );
    
    expect(screen.getByText('$1,234,567')).toBeInTheDocument();
  });
});
