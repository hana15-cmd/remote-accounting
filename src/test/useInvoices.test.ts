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
    
    act(() => {
      // Clear existing and add known invoices
      const currentIds = result.current.invoices.map(inv => inv.id);
      currentIds.forEach(id => result.current.deleteInvoice(id));
      
      result.current.addInvoice({
        client: 'Client 1',
        amount: 100,
        status: 'Paid',
        date: '2026-02-24',
      });
      result.current.addInvoice({
        client: 'Client 2',
        amount: 200,
        status: 'Pending',
        date: '2026-02-24',
      });
    });
    
    expect(result.current.totals.total).toBe(300);
  });

  it('should calculate paid amount correctly', () => {
    const { result } = renderHook(() => useInvoices());
    
    act(() => {
      const currentIds = result.current.invoices.map(inv => inv.id);
      currentIds.forEach(id => result.current.deleteInvoice(id));
      
      result.current.addInvoice({
        client: 'Client 1',
        amount: 100,
        status: 'Paid',
        date: '2026-02-24',
      });
      result.current.addInvoice({
        client: 'Client 2',
        amount: 200,
        status: 'Pending',
        date: '2026-02-24',
      });
    });
    
    expect(result.current.totals.paid).toBe(100);
  });

  it('should calculate pending amount correctly', () => {
    const { result } = renderHook(() => useInvoices());
    
    act(() => {
      const currentIds = result.current.invoices.map(inv => inv.id);
      currentIds.forEach(id => result.current.deleteInvoice(id));
      
      result.current.addInvoice({
        client: 'Client 1',
        amount: 100,
        status: 'Paid',
        date: '2026-02-24',
      });
      result.current.addInvoice({
        client: 'Client 2',
        amount: 200,
        status: 'Pending',
        date: '2026-02-24',
      });
    });
    
    expect(result.current.totals.pending).toBe(200);
  });
});
