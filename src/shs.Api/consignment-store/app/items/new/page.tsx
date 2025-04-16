"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash } from "lucide-react"
import { consignments, store } from "@/lib/api"
import { MultiSelect } from "@/components/ui/multi-select"

interface Owner {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
}

interface Item {
  name: string;
  description: string;
  condition: string;
  price: string;
  color: string;
  brandId: string;
  tags: string[];
  size: string;
  receiveDate: string;
}
interface Brand {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

export default function NewItemPage() {
  const router = useRouter()
  const [owners, setOwners] = useState<any>({})
  const [tags, setTags] = useState<Tag[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [ownerId, setOwnerId] = useState("")
  const [items, setItems] = useState<Item[]>([{
    name: "",
    description: "",
    condition: "",
    price: "",
    color: "",
    brandId: "",
    tags: [],
    size: "",
    receiveDate: new Date().toISOString().split('T')[0]
  }])

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await consignments.getOwners()
        setOwners(response)
      } catch (error) {
        console.error("Error fetching owners:", error)
      } finally {
        setIsLoading(false)
      }
    }
    const fetchBrands = async () => {
      try {
        const response = await store.getBrands()
        setBrands(response)
      } catch (error) {
        console.error("Error fetching brands:", error)
      }
    }
    const fetchTags = async () => {
      try {
        const response = await store.getTags()
        setTags(response)
      } catch (error) {
        console.error("Error fetching tags:", error)
      }
    }
    fetchBrands();
    fetchTags();
    fetchOwners()
  }, [])

  const handleItemChange = (index: number, field: keyof Item, value: string | string[]) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      [field]: value
    }
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { name: "", description: "", condition: "", price: "", color: "", brandId: "", tags: [], size: "", receiveDate: new Date().toISOString().split('T')[0] }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items]
      newItems.splice(index, 1)
      setItems(newItems)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await consignments.createConsignment({
        supplierId: parseInt(ownerId),
        consignmentDate: new Date().toISOString(),
        items: items.map(item => ({
          name: item.name,
          description: item.description,
          price: parseFloat(item.price),
          condition: item.condition,
          color: item.color,
          brandId: parseInt(item.brandId),
          tagIds: item.tags.map(tag => parseInt(tag)),
          size: parseInt(item.size),
          receiveDate: item.receiveDate,
          status: 0 // Assuming 0 is the initial status
        }))
      })
      router.push("/items")
    } catch (error) {
      console.error("Error creating consignment:", error)
    }
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
                <Select value={ownerId} onValueChange={setOwnerId} required disabled={isLoading}>
                  <SelectTrigger id="owner">
                    <SelectValue placeholder={isLoading ? "Loading owners..." : "Select an owner"} />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.items.map((owner : any) => (
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`item-color-${index}`}>Color</Label>
                          <Input
                            id={`item-color-${index}`}
                            value={item.color}
                            onChange={(e) => handleItemChange(index, "color", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`item-brand-${index}`}>Brand</Label>
                          <Select
                            value={item.brandId}
                            onValueChange={(value) => handleItemChange(index, "brandId", value)}
                            required
                          >
                            <SelectTrigger id={`item-brand-${index}`}>
                              <SelectValue placeholder="Select brand" />
                            </SelectTrigger>
                            <SelectContent>
                              {brands.map((brand) => (
                                <SelectItem key={brand.id} value={brand.id.toString()}>
                                  {brand.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`item-size-${index}`}>Size</Label>
                          <Select
                            value={item.size}
                            onValueChange={(value) => handleItemChange(index, "size", value)}
                            required
                          >
                            <SelectTrigger id={`item-size-${index}`}>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="XS">XS</SelectItem>
                              <SelectItem value="S">S</SelectItem>
                              <SelectItem value="M">M</SelectItem>
                              <SelectItem value="L">L</SelectItem>
                              <SelectItem value="XL">XL</SelectItem>
                              <SelectItem value="XXL">XXL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`item-receive-date-${index}`}>Receive Date</Label>
                          <Input
                            id={`item-receive-date-${index}`}
                            type="date"
                            value={item.receiveDate}
                            onChange={(e) => handleItemChange(index, "receiveDate", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`item-tags-${index}`}>Tags</Label>
                        <MultiSelect
                          options={tags.map(tag => ({
                            value: tag.id.toString(),
                            label: tag.name
                          }))}
                          selected={item.tags}
                          onChange={(values) => handleItemChange(index, "tags", values)}
                          placeholder="Select tags"
                        />
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
