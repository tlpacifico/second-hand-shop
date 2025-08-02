"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { consignments } from "@/lib/api"
import ConsignmentItemForm from "@/components/consignment-item-form"
import { use } from "react"

export default function EditConsignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const unwrappedParams = use(params)
  const [initialValues, setInitialValues] = useState<{
    supplierId: string;
    items: Array<{
      id: number;
      name: string;
      description: string;
      price: string;
      color: string;
      brandId: string;
      tags: string[];
      size: string;
      receiveDate: string;
      isDeleted: boolean;
    }>;
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchConsignment = async () => {
      try {
        const consignment = await consignments.getConsignmentDetails(parseInt(unwrappedParams.id))
        setInitialValues({
          supplierId: consignment.supplierId.toString(),
          items: consignment.items.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || "",
            price: item.evaluatedValue.toString(),
            color: item.color || "",
            brandId: item.brandId?.toString() || "",
            tags: item.tagIds?.map(id => id.toString()) || [],
            size: item.size,
            receiveDate: new Date().toISOString().split('T')[0], // Default to today since we don't have this in the API
            isDeleted: false // Add the missing isDeleted property
          }))
        })
      } catch (error) {
        console.error("Error fetching consignment:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConsignment()
  }, [unwrappedParams.id])

  const handleSubmit = async (data: {
    supplierId: number;
    consignmentDate: string;
    items: Array<{
      name: string;
      description?: string;
      price: number;
      color?: string;
      brandId?: number;
      tagIds?: number[];
      size: string;
    }>;
  }) => {
    try {
      const existingItems = initialValues?.items.filter(item => !item.isDeleted) || [];
      await consignments.updateConsignment(parseInt(unwrappedParams.id), {
        ...data,
        items: existingItems.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: parseFloat(item.price),
          color: item.color,
          brandId: parseInt(item.brandId),
          tagIds: item.tags.map(tag => parseInt(tag)),
          size: item.size
        })),
        newItems: data.items,
        deletedItemsIds: initialValues?.items.filter(item => item.isDeleted).map(item => item.id) || []
      })
      router.push("/consignments")
    } catch (error) {
      console.error("Error updating consignment:", error)
    }
  }

  if (isLoading) {
    return (
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex justify-center items-center h-32">
          <p>Loading consignment...</p>
        </div>
      </main>
    )
  }

  if (!initialValues) {
    return (
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex justify-center items-center h-32">
          <p>Consignment not found</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/consignments">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Consignment</h1>
        </div>

        <ConsignmentItemForm
          mode="edit"
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/consignments")}
        />
      </div>
    </main>
  )
} 