import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInvoices } from '../hooks/useInvoice';

describe('useInvoices', () => {
  it('should initialize with generated invoices', () => {
    const { result } = renderHook(() => useInvoices());
    expect(result.current.invoices.length).toBeGreaterThan(0);
  });

  it('should add a new invoice', () => {
    const { result } = renderHook(() => useInvoices());
    const initialCount = result.current.invoices.length;
    
    act(() => {
      result.current.addInvoice({
        client: 'Test Client',
        amount: 500,
        status: 'Pending',
        date: '2026-02-24',
      });
    });
    
    expect(result.current.invoices.length).toBe(initialCount + 1);
    expect(result.current.invoices[0].client).toBe('Test Client');
    expect(result.current.invoices[0].amount).toBe(500);
  });

  it('should generate invoice number for new invoice', () => {
    const { result } = renderHook(() => useInvoices());
    
    act(() => {
      result.current.addInvoice({
        client: 'Test',
        amount: 100,
        status: 'Paid',
        date: '2026-02-24',
      });
    });
    
    const newInvoice = result.current.invoices[0];
    expect(newInvoice.invoiceNumber).toMatch(/INV-\d{3}/);
  });

  it('should delete an invoice', () => {
    const { result } = renderHook(() => useInvoices());
    const invoiceToDelete = result.current.invoices[0];
    const initialCount = result.current.invoices.length;
    
    act(() => {
      result.current.deleteInvoice(invoiceToDelete.id);
    });
    
    expect(result.current.invoices.length).toBe(initialCount - 1);
    expect(result.current.invoices.find(inv => inv.id === invoiceToDelete.id)).toBeUndefined();
  });

  it('should update an invoice field', () => {
    const { result } = renderHook(() => useInvoices());
    const invoiceToUpdate = result.current.invoices[0];
    
    act(() => {
      result.current.updateInvoice(invoiceToUpdate.id, 'client', 'Updated Client');
    });
    
    const updatedInvoice = result.current.invoices.find(inv => inv.id === invoiceToUpdate.id);
    expect(updatedInvoice?.client).toBe('Updated Client');
  });

  it('should calculate total amount correctly', () => {
    const { result } = renderHook(() => useInvoices());
    
    // Just verify totals exist and are calculated
    expect(result.current.totals.total).toBeGreaterThan(0);
    expect(result.current.totals.total).toBe(
      result.current.totals.paid + result.current.totals.pending
    );
  });

  it('should calculate paid amount correctly', () => {
    const { result } = renderHook(() => useInvoices());
    
    const paidInvoices = result.current.invoices.filter(inv => inv.status === 'Paid');
    const expectedPaid = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    
    expect(result.current.totals.paid).toBe(expectedPaid);
  });

  it('should calculate pending amount correctly', () => {
    const { result } = renderHook(() => useInvoices());
    
    const pendingInvoices = result.current.invoices.filter(inv => inv.status === 'Pending');
    const expectedPending = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    
    expect(result.current.totals.pending).toBe(expectedPending);
  });
  
  it('should calculate paid and pending counts correctly', () => {
    const { result } = renderHook(() => useInvoices());
    
    const paidCount = result.current.invoices.filter(inv => inv.status === 'Paid').length;
    const pendingCount = result.current.invoices.filter(inv => inv.status === 'Pending').length;
    
    expect(result.current.totals.paidCount).toBe(paidCount);
    expect(result.current.totals.pendingCount).toBe(pendingCount);
  });
  
  it('should update totals when invoice status changes', () => {
    const { result } = renderHook(() => useInvoices());
    
    const initialPaid = result.current.totals.paid;
    const initialPending = result.current.totals.pending;
    
    // Find a pending invoice and change it to paid
    const pendingInvoice = result.current.invoices.find(inv => inv.status === 'Pending');
    
    if (pendingInvoice) {
      act(() => {
        result.current.updateInvoice(pendingInvoice.id, 'status', 'Paid');
      });
      
      // Paid should increase, pending should decrease
      expect(result.current.totals.paid).toBeGreaterThan(initialPaid);
      expect(result.current.totals.pending).toBeLessThan(initialPending);
    }
  });
});
