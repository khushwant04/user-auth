"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

export function InvoiceFilters() {
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  const toggleStatus = (status: string) => {
    setStatusFilter((current) =>
      current.includes(status) ? current.filter((s) => s !== status) : [...current, status],
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Icons.chevronsUpDown className="mr-2 h-4 w-4" />
          Filter
          {statusFilter.length > 0 && (
            <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
              {statusFilter.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={statusFilter.includes("paid")} onCheckedChange={() => toggleStatus("paid")}>
          Paid
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={statusFilter.includes("pending")}
          onCheckedChange={() => toggleStatus("pending")}
        >
          Pending
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={statusFilter.includes("overdue")}
          onCheckedChange={() => toggleStatus("overdue")}
        >
          Overdue
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

