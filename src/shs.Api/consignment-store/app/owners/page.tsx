"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import { consignments } from "@/lib/api"
import { useEffect, useState } from "react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { PagedModel, ConsignmentSupplierEntity } from '../../lib/api'


export default function OwnersPage() {
  const [owners, setOwners] = useState<PagedModel<ConsignmentSupplierEntity>>({
    items: [],
    total: 0,
    skip: 0,
    take: 10
  } as PagedModel<ConsignmentSupplierEntity>)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)


  useEffect(() => {
    const fetchOwners = async () => {
      try {       
        const response = await consignments.getOwners(owners.skip, owners.take)
        setOwners({
          items: response.items,
          total: response.total,
          skip: response.skip + owners.take,
          take: response.take
        })
        setError(null)
      } catch (err) {
        setError("Failed to load owners")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOwners()
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setLoading(true)
  }

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
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Initial</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {owners.items.map((owner) => (
                    <TableRow key={owner.id}>
                      <TableCell className="font-medium">{owner.name}</TableCell>
                      <TableCell>{owner.email}</TableCell>
                      <TableCell>{owner.phoneNumber}</TableCell>
                      <TableCell>{owner.initials}</TableCell>
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
              
              <Pagination className="justify-center">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) handlePageChange(currentPage - 1)
                      }}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {[...Array(owners.total)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(i + 1)
                        }}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (owners.skip + owners.take < owners.total) handlePageChange(currentPage + 1)
                      }}
                      className={currentPage >= owners.total / owners.take ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
