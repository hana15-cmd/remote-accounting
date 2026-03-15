import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InvoiceForm from '../components/InvoiceForm';

describe('InvoiceForm', () => {
  it('should render form title', () => {
    const mockOnAdd = vi.fn();
    render(<InvoiceForm onAdd={mockOnAdd} />);
    expect(screen.getByText('Add Invoice')).toBeInTheDocument();
  });

  it('should render all form inputs', () => {
    const mockOnAdd = vi.fn();
    render(<InvoiceForm onAdd={mockOnAdd} />);
    
    expect(screen.getByPlaceholderText('Client')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
  });

  it('should render submit button', () => {
    const mockOnAdd = vi.fn();
    render(<InvoiceForm onAdd={mockOnAdd} />);
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('should update client name input', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    render(<InvoiceForm onAdd={mockOnAdd} />);
    
    const clientInput = screen.getByPlaceholderText('Client') as HTMLInputElement;
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
    
    const clientInput = screen.getByPlaceholderText('Client');
    const amountInput = screen.getByPlaceholderText('Amount');
    const submitButton = screen.getByRole('button', { name: /add/i });
    
    await user.type(clientInput, 'New Client');
    await user.type(amountInput, '750');
    await user.click(submitButton);
    
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith({
      client: 'New Client',
      amount: 750,
      status: 'Pending',
      date: expect.any(String),
    });
  });

  it('should clear form after submission', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    render(<InvoiceForm onAdd={mockOnAdd} />);
    
    const clientInput = screen.getByPlaceholderText('Client') as HTMLInputElement;
    const amountInput = screen.getByPlaceholderText('Amount') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /add/i });
    
    await user.type(clientInput, 'Test');
    await user.type(amountInput, '100');
    await user.click(submitButton);
    
    expect(clientInput.value).toBe('');
    expect(amountInput.value).toBe('');
  });
  
  it('should not submit form when client is missing', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    render(<InvoiceForm onAdd={mockOnAdd} />);
    
    const amountInput = screen.getByPlaceholderText('Amount');
    const submitButton = screen.getByRole('button', { name: /add/i });
    
    await user.type(amountInput, '100');
    await user.click(submitButton);
    
    expect(mockOnAdd).not.toHaveBeenCalled();
  });
  
  it('should not submit form when amount is missing', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    render(<InvoiceForm onAdd={mockOnAdd} />);
    
    const clientInput = screen.getByPlaceholderText('Client');
    const submitButton = screen.getByRole('button', { name: /add/i });
    
    await user.type(clientInput, 'Test Client');
    await user.click(submitButton);
    
    expect(mockOnAdd).not.toHaveBeenCalled();
  });
});
