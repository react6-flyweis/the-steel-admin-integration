import { useMutation } from "@tanstack/react-query";
import {
  createInvoiceProvider,
  type CreateInvoicePayload,
} from "./invoices.api";

export function useCreateInvoiceMutation() {
  return useMutation({
    mutationFn: (payload: CreateInvoicePayload) =>
      createInvoiceProvider(payload),
  });
}
