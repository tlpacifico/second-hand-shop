import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Package, Calendar, User } from 'lucide-react'
import { consignments, type ConsignmentSearchResult, type PagedModel } from '@/lib/api'

export const Route = createFileRoute('/consignments')({
  component: ConsignmentsPage,
})

function ConsignmentsPage() {
  const [consignmentsData, setConsignmentsData] = useState<PagedModel<ConsignmentSearchResult> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadConsignments()
  }, [])

  const loadConsignments = async () => {
    try {
      setLoading(true)
      const data = await consignments.getPaginatedConsignments(0, 10)
      setConsignmentsData(data)
    } catch (err) {
      setError('Failed to load consignments')
      console.error('Error loading consignments:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Consignments</h1>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            New Consignment
          </Button>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Consignments</h1>
          <Button onClick={loadConsignments}>
            <Plus className="mr-2 h-4 w-4" />
            New Consignment
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">{error}</p>
              <Button variant="outline" onClick={loadConsignments} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Consignments</h1>
          <p className="text-muted-foreground">
            Manage consignment agreements and track items
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Consignment
        </Button>
      </div>

      {consignmentsData?.items.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No consignments found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first consignment agreement.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Consignment
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {consignmentsData?.items.map((consignment) => (
            <Card key={consignment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Consignment #{consignment.id}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {consignment.supplierName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(consignment.consignmentDate)}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {consignment.totalItems} items
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Created on {formatDate(consignment.consignmentDate)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {consignmentsData && consignmentsData.total > consignmentsData.items.length && (
        <div className="flex justify-center">
          <Button variant="outline">
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
