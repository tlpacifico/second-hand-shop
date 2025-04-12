import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"

// Mock data - would come from a database in a real application
const owners = [
  { id: 1, name: "Sarah Johnson", email: "sarah@example.com", phone: "(555) 123-4567", itemCount: 12 },
  { id: 2, name: "Michael Smith", email: "michael@example.com", phone: "(555) 234-5678", itemCount: 8 },
  { id: 3, name: "David Wilson", email: "david@example.com", phone: "(555) 345-6789", itemCount: 15 },
  { id: 4, name: "Emily Brown", email: "emily@example.com", phone: "(555) 456-7890", itemCount: 5 },
  { id: 5, name: "Jessica Davis", email: "jessica@example.com", phone: "(555) 567-8901", itemCount: 10 },
]

export default function OwnersPage() {
  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Owners</h1>
            <p className="text-muted-foreground">Manage your consignment item owners.</p>
          </div>
          <Button asChild>
            <Link href="/owners/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Owner
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Owner Directory</CardTitle>
            <CardDescription>View and manage all registered owners.</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search owners..." className="w-full bg-background pl-8 md:max-w-sm" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {owners.map((owner) => (
                  <TableRow key={owner.id}>
                    <TableCell className="font-medium">{owner.name}</TableCell>
                    <TableCell>{owner.email}</TableCell>
                    <TableCell>{owner.phone}</TableCell>
                    <TableCell>{owner.itemCount}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/owners/${owner.id}`}>View</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/owners/${owner.id}/edit`}>Edit</Link>
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
