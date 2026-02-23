import { faker } from "@faker-js/faker";
import type { Invoice } from "../types/invoice";

export function generateDummyInvoices(): Invoice[] {
  return Array.from({ length: 15 }, (_, index) => ({
    id: index + 1,
    client: faker.company.name(),
    amount: parseFloat(
      faker.finance.amount({ min: 500, max: 5000, dec: 0 })
    ),
    status: faker.helpers.arrayElement(["Paid", "Pending"]),
    date: faker.date.past({ years: 1 }).toISOString().split("T")[0],
    invoiceNumber: `INV-${String(index + 1).padStart(3, "0")}`,
  }));
}