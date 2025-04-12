"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send } from "lucide-react"

// Mock data - would come from a database in a real application
const consignment = {
  id: "CON001",
  owner: {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
  },
  date: "2023-04-15",
  items: [
    { id: 1, name: "Vintage Lamp", description: "1960s table lamp with original shade", suggestedPrice: 45.0 },
    { id: 2, name: "Antique Book", description: "First edition classic novel from 1920", suggestedPrice: 65.0 },
    { id: 3, name: "Handmade Quilt", description: "Queen size quilt with floral pattern", suggestedPrice: 95.0 },
    { id: 4, name: "Ceramic Vase", description: "Hand-painted ceramic vase, minor chip on base", suggestedPrice: 35.0 },
    {
      id: 5,
      name: "Vintage Record Player",
      description: "Working condition, includes 5 vinyl records",
      suggestedPrice: 85.0,
    },
  ],
}

export default function ReviewConsignmentPage() {
  const router = useRouter()
  const [items, setItems] = useState(
    consignment.items.map((item) => ({
      ...item,
      accepted: true,
      price: item.suggestedPrice.toFixed(2),
    })),
  )

  const handleAcceptedChange = (id, accepted) => {
    setItems(items.map((item) => (item.id === id ? { ...item, accepted } : item)))
  }

  const handlePriceChange = (id, price) => {
    setItems(items.map((item) => (item.id === id ? { ...item, price } : item)))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would save to a database
    console.log("Submitting review:", {
      consignmentId: consignment.id,
      items: items.map((item) => ({
        id: item.id,
        accepted: item.accepted,
        price: Number.parseFloat(item.price),
      })),
    })

    // Simulate successful save and redirect
    setTimeout(() => {
      router.push("/consignments")
    }, 500)
  }

  const acceptedItems = items.filter((item) => item.accepted)

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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Review Consignment</h1>
            <p className="text-muted-foreground">
              Consignment #{consignment.id} from {consignment.owner.name}
            </p>
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Review Items</CardTitle>
              <CardDescription>Accept or reject items and set final prices.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <Checkbox
                    id={`accept-${item.id}`}
                    checked={item.accepted}
                    onCheckedChange={(checked) => handleAcceptedChange(item.id, checked)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`accept-${item.id}`} className="text-base font-medium">
                      {item.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`price-${item.id}`} className="w-12">
                        Price:
                      </Label>
                      <div className="relative w-32">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input
                          id={`price-${item.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handlePriceChange(item.id, e.target.value)}
                          className="pl-7"
                          disabled={!item.accepted}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Summary</h3>
                <p>Total items: {items.length}</p>
                <p>Accepted items: {acceptedItems.length}</p>
                <p>Rejected items: {items.length - acceptedItems.length}</p>
                <p className="font-medium mt-2">
                  Total value: ${acceptedItems.reduce((sum, item) => sum + Number.parseFloat(item.price), 0).toFixed(2)}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <div className="w-full space-y-2">
                <Label htmlFor="notes">Notes for Owner</Label>
                <Textarea id="notes" placeholder="Add any notes about the accepted/rejected items..." rows={3} />
              </div>
              <div className="flex justify-between w-full">
                <Button variant="outline" type="button" asChild>
                  <Link href="/consignments">Cancel</Link>
                </Button>
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  Complete Review & Send Report
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}
