import { Download, FileText, MoreHorizontal, Eye, Mail, AlertCircle } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: string;
  pdfUrl: string;
}

interface InvoiceListProps {
  invoices: Invoice[];
}

export function InvoiceList({ invoices }: InvoiceListProps) {
  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <FileText className="w-12 h-12 mb-4 opacity-20" />
        <p>No invoices available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-2 rounded-md group-hover:bg-primary/20 transition-colors">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-medium text-sm group-hover:text-primary transition-colors">
                {new Date(invoice.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                ₹{invoice.amount.toFixed(2)} • <span className="capitalize font-medium">{invoice.status}</span>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100 data-open:opacity-100">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => alert(`Viewing details for ${invoice.id}`)} className="cursor-pointer">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(invoice.pdfUrl, '_blank')} className="cursor-pointer">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => alert(`Sending receipt for ${invoice.id}`)} className="cursor-pointer">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Receipt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert(`Reporting issue with ${invoice.id}`)} className="cursor-pointer text-destructive focus:text-destructive">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Report Issue
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}
