import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

// Mock data - would come from a database in a real application
const consignments = [
  {
    id: "CON001",
    owner: "Sarah Johnson",
    date: "2023-04-15",
    itemCount: 12,
    status: "Pending Review",
  },
  {
    id: "CON002",
    owner: "Michael Smith",
    date: "2023-04-10",
    itemCount: 8,
    status: "Accepted",
  },
  {
    id: "CON003",
    owner: "David Wilson",
    date: "2023-03-22",
    itemCount: 15,
    status: "Completed",
  },
  {
    id: "CON004",
    owner: "Emily Brown",
    date: "2023-04-05",
    itemCount: 5,
    status: "Accepted",
  },
  {
    id: "CON005",
    owner: "Jessica Davis",
    date: "2023-03-15",
    itemCount: 10,
    status: "Completed",
  },
]

export default function ConsignmentsPage() {
  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Consignments</h1>
            <p className="text-muted-foreground">Manage consignment batches from owners.</p>
          </div>
          <Button asChild>
            <Link href="/consignments/new">
              <Plus className="mr-2 h-4 w-4" />
              New Consignment
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Consignments</CardTitle>
            <CardDescription>View and manage consignment batches.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consignments.map((consignment) => (
                  <TableRow key={consignment.id}>
                    <TableCell className="font-mono text-sm">{consignment.id}</TableCell>
                    <TableCell className="font-medium">{consignment.owner}</TableCell>
                    <TableCell>{consignment.date}</TableCell>
                    <TableCell>{consignment.itemCount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          consignment.status === "Pending Review"
                            ? "outline"
                            : consignment.status === "Accepted"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {consignment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/consignments/${consignment.id}`}>View</Link>
                      </Button>
                      {consignment.status === "Pending Review" && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/consignments/${consignment.id}/review`}>Review</Link>
                        </Button>
                      )}
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
