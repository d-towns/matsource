"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type Part = {
  url?: string
  part?: string
  year?: string
  model?: string
  grade?: string
  stockNumber?: string
  price?: string
  distance?: string
  deliveryTime?: string
  inStock?: boolean
  store: {
    id?: string
    name?: string
    location?: string
    phone?: string
  }
}

export const columns: ColumnDef<Part>[] = [
  {
    accessorKey: "store.name",
    header: "Store",
  },
  {
    accessorKey: "part",
    header: "Part Name"
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "model", 
    header: "Model",
  },
  {
    accessorKey: "grade",
    header: "Grade",
  },
  {
    accessorKey: "stockNumber",
    header: "Stock Number",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "distance",
    header: "Distance",
  },
  {
    accessorKey: "deliveryTime",
    header: "Delivery Time",
  },
  {
    accessorKey: "inStock",
    header: "In Stock",
  },
  {
    accessorKey: "url",
    header: "URL",
  }
]
