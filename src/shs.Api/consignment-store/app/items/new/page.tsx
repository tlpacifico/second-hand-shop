"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash } from "lucide-react"

// Mock data - would come from a database in a real application
const owners = [
  { id: 1, name: "Sarah Johnson" },
  { id: 2, name: "Michael Smith" },
  { id: 3, name: "David Wilson" },
  { id: 4, name: "Emily Brown" },
  { id: 5, name: "Jessica Davis" },
]

export default function NewItemPage() {
  const router = useRouter()
  const [ownerId, setOwnerId] = useState("")
  const [items, setItems] = useState([{ name: "", description: "", condition: "", price: "" }])

  const handleItemChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { name: "", description: "", condition: "", price: "" }])
  }

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = [...items]
      newItems.splice(index, 1)
      setItems(newItems)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would save to a database
    console.log("Submitting items:", { ownerId, items })

    // Simulate successful save and redirect
    setTimeout(() => {
      router.push("/items")
    }, 500)
  }

  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/items">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Add New Items</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Consignment Items</CardTitle>
              <CardDescription>Add new items from an owner for consignment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="owner">Select Owner</Label>
                <Select value={ownerId} onValueChange={setOwnerId} required>
                  <SelectTrigger id="owner">
                    <SelectValue placeholder="Select an owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((owner) => (
                      <SelectItem key={owner.id} value={owner.id.toString()}>
                        {owner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Items</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Item
                  </Button>
                </div>

                {items.map((item, index) => (
                  <Card key={index}>
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Item {index + 1}</CardTitle>
                        {items.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`item-name-${index}`}>Item Name</Label>
                          <Input
                            id={`item-name-${index}`}
                            value={item.name}
                            onChange={(e) => handleItemChange(index, "name", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`item-price-${index}`}>Price ($)</Label>
                          <Input
                            id={`item-price-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, "price", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`item-description-${index}`}>Description</Label>
                        <Textarea
                          id={`item-description-${index}`}
                          value={item.description}
                          onChange={(e) => handleItemChange(index, "description", e.target.value)}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`item-condition-${index}`}>Condition</Label>
                        <Select
                          value={item.condition}
                          onValueChange={(value) => handleItemChange(index, "condition", value)}
                          required
                        >
                          <SelectTrigger id={`item-condition-${index}`}>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="like-new">Like New</SelectItem>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href="/items">Cancel</Link>
              </Button>
              <Button type="submit">Save Items</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}
