# Accounting MFE Tests

## Overview
Comprehensive test suite for the Accounting MFE application using Vitest and React Testing Library.

## Test Files

### App.test.tsx
Tests for the main Accounting App component:
- ✅ Renders accounting title
- ✅ Renders SummaryCards, InvoiceForm, and InvoiceTable components
- ✅ Displays initial invoices from generated data
- ✅ Verifies layout structure

### InvoiceForm.test.tsx
Tests for the invoice form component:
- ✅ Renders form with all inputs (client name, amount, status)
- ✅ Handles user input and form updates
- ✅ Submits form with valid data
- ✅ Clears form after submission
- ✅ Calls onAdd callback correctly

### SummaryCards.test.tsx
Tests for the summary statistics cards:
- ✅ Renders all summary cards (Total Amount, Paid, Pending, Total Invoices)
- ✅ Displays formatted currency values
- ✅ Handles zero values
- ✅ Formats large numbers correctly (with commas)
- ✅ Verifies grid layout

### useInvoices.test.ts
Tests for the invoices hook:
- ✅ Initializes with generated invoices
- ✅ Adds new invoices with auto-generated ID and invoice number
- ✅ Deletes invoices
- ✅ Updates invoice fields
- ✅ Calculates totals correctly (total, paid, pending amounts)

## Running Tests

```bash
# Run all tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Coverage
- 4 test files
- 35+ test cases
- Components: App, InvoiceForm, InvoiceTable, SummaryCards
- Hooks: useInvoices
- Full business logic testing including CRUD operations

## Notes
- Tests include both component and hook testing
- Form interactions tested with user-event
- Number formatting verified for currency display
- Invoice calculations validated
