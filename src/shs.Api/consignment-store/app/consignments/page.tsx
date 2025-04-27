"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import { consignments } from "@/lib/api"

export default function ConsignmentsPage() {
  const [data, setData] = useState<{
    items: Array<{
      id: number;
      consignmentDate: string;
      supplierName: string;
      totalItems: number;
    }>;
    total: number;
    skip: number;
    take: number;
  }>({
    items: [],
    total: 0,
    skip: 0,
    take: 10
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConsignments = async () => {
      try {
        const response = await consignments.getPaginatedConsignments(data.skip, data.take);
        setData(response);
      } catch (error) {
        console.error("Error fetching consignments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsignments();
  }, [data.skip, data.take]);

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
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <p>Loading consignments...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((consignment) => (
                    <TableRow key={consignment.id}>
                      <TableCell className="font-mono text-sm">{consignment.id}</TableCell>
                      <TableCell className="font-medium">{consignment.supplierName}</TableCell>
                      <TableCell>{new Date(consignment.consignmentDate).toLocaleDateString()}</TableCell>
                      <TableCell>{consignment.totalItems}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/consignments/${consignment.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
