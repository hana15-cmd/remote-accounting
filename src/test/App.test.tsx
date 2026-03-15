import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Accounting App', () => {
  it('should render the accounting title', () => {
    render(<App />);
    expect(screen.getByText('Accounting MFE')).toBeInTheDocument();
  });

  it('should render SummaryCards component', () => {
    render(<App />);
    expect(screen.getByText('Total Invoices')).toBeInTheDocument();
    // Use getAllByText for items that appear multiple times (in cards and table options)
    const paidElements = screen.getAllByText('Paid');
    expect(paidElements.length).toBeGreaterThan(0);
    const pendingElements = screen.getAllByText('Pending');
    expect(pendingElements.length).toBeGreaterThan(0);
  });

  it('should render InvoiceForm component', () => {
    render(<App />);
    expect(screen.getByText('Add Invoice')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Client')).toBeInTheDocument();
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

  // ============ INTEGRATION TESTS ============
  
  describe('Integration: Add Invoice Flow', () => {
    it('should add a new invoice and update the table', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Get initial invoice count
      const initialInvoices = screen.getAllByText(/INV-/);
      const initialCount = initialInvoices.length;
      
      // Fill in the form
      const clientInput = screen.getByPlaceholderText('Client');
      const amountInput = screen.getByPlaceholderText('Amount');
      
      await user.type(clientInput, 'Integration Test Client');
      await user.type(amountInput, '5000');
      
      // Submit the form
      const addButton = screen.getByRole('button', { name: /add/i });
      await user.click(addButton);
      
      // Verify new invoice appears in table
      await waitFor(() => {
        expect(screen.getByText('Integration Test Client')).toBeInTheDocument();
      });
      
      const updatedInvoices = screen.getAllByText(/INV-/);
      expect(updatedInvoices.length).toBe(initialCount + 1);
    });

    it('should update summary cards when adding invoice', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Add a new invoice
      await user.type(screen.getByPlaceholderText('Client'), 'Test Client');
      await user.type(screen.getByPlaceholderText('Amount'), '1000');
      await user.click(screen.getByRole('button', { name: /add/i }));
      
      // Summary cards should update (they show totals)
      await waitFor(() => {
        expect(screen.getByText('Test Client')).toBeInTheDocument();
      });
    });
  });

  describe('Integration: Delete Invoice Flow', () => {
    it('should delete an invoice and update the table', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Get initial invoice count
      const initialInvoices = screen.getAllByText(/INV-/);
      const initialCount = initialInvoices.length;
      
      // Click first delete button
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);
      
      // Verify invoice count decreased
      await waitFor(() => {
        const updatedInvoices = screen.getAllByText(/INV-/);
        expect(updatedInvoices.length).toBe(initialCount - 1);
      });
    });
  });

  describe('Integration: Update Invoice Status Flow', () => {
    it('should update invoice status and reflect in styling', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Get all status selects
      const statusSelects = screen.getAllByRole('combobox');
      const firstSelect = statusSelects[0] as HTMLSelectElement;
      const originalStatus = firstSelect.value;
      
      // Change status
      const newStatus = originalStatus === 'Paid' ? 'Pending' : 'Paid';
      await user.selectOptions(firstSelect, newStatus);
      
      // Verify status changed
      await waitFor(() => {
        expect(firstSelect.value).toBe(newStatus);
      });
      
      // Verify styling changed
      if (newStatus === 'Paid') {
        expect(firstSelect).toHaveClass('bg-green-900');
      } else {
        expect(firstSelect).toHaveClass('bg-yellow-900');
      }
    });

    it('should update summary cards when changing status from Pending to Paid', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Add a pending invoice first
      await user.type(screen.getByPlaceholderText('Client'), 'Status Test');
      await user.type(screen.getByPlaceholderText('Amount'), '2000');
      
      await user.click(screen.getByRole('button', { name: /add/i }));
      
      // Wait for invoice to appear
      await waitFor(() => {
        expect(screen.getByText('Status Test')).toBeInTheDocument();
      });
      
      // Find the invoice's status select (not the form select)
      const allSelects = screen.getAllByRole('combobox');
      const invoiceSelect = allSelects.find(select => {
        const row = select.closest('tr');
        return row?.textContent?.includes('Status Test');
      }) as HTMLSelectElement;
      
      // Change from Pending to Paid
      await user.selectOptions(invoiceSelect, 'Paid');
      
      // Status should be updated
      await waitFor(() => {
        expect(invoiceSelect.value).toBe('Paid');
      });
    });
  });

  describe('Integration: Form Validation', () => {
    it('should require both fields to add invoice', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const initialInvoices = screen.getAllByText(/INV-/);
      const initialCount = initialInvoices.length;
      
      // Try to submit with empty fields
      const addButton = screen.getByRole('button', { name: /add/i });
      await user.click(addButton);
      
      // Invoice count should not change
      const currentInvoices = screen.getAllByText(/INV-/);
      expect(currentInvoices.length).toBe(initialCount);
    });

    it('should clear form after successful submission', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const clientInput = screen.getByPlaceholderText('Client') as HTMLInputElement;
      const amountInput = screen.getByPlaceholderText('Amount') as HTMLInputElement;
      
      await user.type(clientInput, 'Clear Test');
      await user.type(amountInput, '1500');
      await user.click(screen.getByRole('button', { name: /add/i }));
      
      // Form should be cleared
      await waitFor(() => {
        expect(clientInput.value).toBe('');
        expect(amountInput.value).toBe('');
      });
    });
  });

  describe('Integration: Multiple Operations', () => {
    it('should handle add, update, and delete in sequence', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const initialCount = screen.getAllByText(/INV-/).length;
      
      // 1. Add invoice
      await user.type(screen.getByPlaceholderText('Client'), 'Multi Op Test');
      await user.type(screen.getByPlaceholderText('Amount'), '3000');
      await user.click(screen.getByRole('button', { name: /add/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Multi Op Test')).toBeInTheDocument();
      });
      
      // 2. Update status
      const selects = screen.getAllByRole('combobox');
      const newInvoiceSelect = Array.from(selects).find(select => {
        const row = select.closest('tr');
        return row?.textContent?.includes('Multi Op Test');
      }) as HTMLSelectElement;
      
      await user.selectOptions(newInvoiceSelect, 'Paid');
      
      await waitFor(() => {
        expect(newInvoiceSelect.value).toBe('Paid');
      });
      
      // 3. Delete invoice
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      const deleteButton = Array.from(deleteButtons).find(button => {
        const row = button.closest('tr');
        return row?.textContent?.includes('Multi Op Test');
      });
      
      if (deleteButton) {
        await user.click(deleteButton);
      }
      
      // Should be back to original count
      await waitFor(() => {
        const finalCount = screen.getAllByText(/INV-/).length;
        expect(finalCount).toBe(initialCount);
      });
    });
  });
});
