import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InvoiceForm from '../components/InvoiceForm';

describe('InvoiceForm', () => {
  it('should render form title', () => {
    const mockOnAdd = vi.fn();
    render(<InvoiceForm onAdd={mockOnAdd} />);
    expect(screen.getByText('Add New Invoice')).toBeInTheDocument();
  });

  it('should render all form inputs', () => {
    const mockOnAdd = vi.fn();
    render(<InvoiceForm onAdd={mockOnAdd} />);
    
    expect(screen.getByPlaceholderText('Client Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render submit button', () => {
    const mockOnAdd = vi.fn();
    render(<InvoiceForm onAdd={mockOnAdd} />);
    expect(screen.getByRole('button', { name: /add invoice/i })).toBeInTheDocument();
  });

  it('should update client name input', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    render(<InvoiceForm onAdd={mockOnAdd} />);
    
    const clientInput = screen.getByPlaceholderText('Client Name') as HTMLInputElement;
    await user.type(clientInput, 'Test Client');
    expect(clientInput.value).toBe('Test Client');
  });

  it('should update amount input', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    render(<InvoiceForm onAdd={mockOnAdd} />);
    
    const amountInput = screen.getByPlaceholderText('Amount') as HTMLInputElement;
    await user.type(amountInput, '500');
    expect(amountInput.value).toBe('500');
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    render(<InvoiceForm onAdd={mockOnAdd} />);
    
    const clientInput = screen.getByPlaceholderText('Client Name');
    const amountInput = screen.getByPlaceholderText('Amount');
    const statusSelect = screen.getByRole('combobox');
    const submitButton = screen.getByRole('button', { name: /add invoice/i });
    
    await user.type(clientInput, 'New Client');
    await user.type(amountInput, '750');
    await user.selectOptions(statusSelect, 'Paid');
    await user.click(submitButton);
    
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });

  it('should clear form after submission', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    render(<InvoiceForm onAdd={mockOnAdd} />);
    
    const clientInput = screen.getByPlaceholderText('Client Name') as HTMLInputElement;
    const amountInput = screen.getByPlaceholderText('Amount') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /add invoice/i });
    
    await user.type(clientInput, 'Test');
    await user.type(amountInput, '100');
    await user.click(submitButton);
    
    expect(clientInput.value).toBe('');
    expect(amountInput.value).toBe('');
  });
});
