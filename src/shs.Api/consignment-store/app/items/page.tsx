import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"

// Mock data - would come from a database in a real application
const items = [
  {
    id: "ITM001",
    name: "Vintage Lamp",
    owner: "Sarah Johnson",
    price: 45.0,
    status: "For Sale",
    dateReceived: "2023-04-15",
  },
  {
    id: "ITM002",
    name: "Antique Chair",
    owner: "Michael Smith",
    price: 120.0,
    status: "For Sale",
    dateReceived: "2023-04-10",
  },
  {
    id: "ITM003",
    name: "Vintage Record Player",
    owner: "David Wilson",
    price: 85.0,
    status: "Sold",
    dateReceived: "2023-03-22",
  },
  {
    id: "ITM004",
    name: "Art Deco Mirror",
    owner: "Emily Brown",
    price: 65.0,
    status: "For Sale",
    dateReceived: "2023-04-05",
  },
  {
    id: "ITM005",
    name: "Handmade Quilt",
    owner: "Jessica Davis",
    price: 95.0,
    status: "Sold",
    dateReceived: "2023-03-15",
  },
]

export default function ItemsPage() {
  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Items</h1>
            <p className="text-muted-foreground">Manage your consignment inventory.</p>
          </div>
          <Button asChild>
            <Link href="/items/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Items
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>View and manage all consignment items.</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search items..." className="w-full bg-background pl-8 md:max-w-sm" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Received</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.owner}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Sold" ? "secondary" : "default"}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>{item.dateReceived}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/items/${item.id}`}>View</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/items/${item.id}/edit`}>Edit</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
