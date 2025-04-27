"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { consignments } from "@/lib/api"
import ConsignmentItemForm from "@/components/consignment-item-form"

export default function NewConsignmentPage() {
  const router = useRouter()

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
      await consignments.createConsignment(data)
      router.push("/consignments")
    } catch (error) {
      console.error("Error creating consignment:", error)
    }
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
          <h1 className="text-3xl font-bold tracking-tight">New Consignment</h1>
        </div>

        <ConsignmentItemForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={() => router.push("/consignments")}
        />
      </div>
    </main>
  )
}
