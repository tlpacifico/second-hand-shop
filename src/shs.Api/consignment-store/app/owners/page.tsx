"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import { consignments } from "@/lib/api"
import { useEffect, useState } from "react"

interface Owner {
  id: number
  name: string
  email: string
  phoneNumber: string
  itemCount: number
}

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await consignments.getOwners()
        setOwners(response.data)
        setError(null)
      } catch (err) {
        setError("Failed to load owners")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOwners()
  }, [])

  if (loading) {
    return (
      <main className="container mx-auto p-4 md:p-6">
        <div>Loading owners...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container mx-auto p-4 md:p-6">
        <div className="text-red-500">{error}</div>
      </main>
    )
  }

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
                    <TableCell>{owner.phoneNumber}</TableCell>
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
