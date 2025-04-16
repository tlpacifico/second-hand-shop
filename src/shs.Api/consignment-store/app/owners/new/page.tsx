"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { consignments } from "@/lib/api"

export default function NewOwnerPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    initial: "",
    commissionPercentageInCash: "",
    commissionPercentageInProducts: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await consignments.createOwner({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        initial: formData.initial,
        address: formData.address || undefined,
        commissionPercentageInCash: formData.commissionPercentageInCash ? parseFloat(formData.commissionPercentageInCash) : undefined,
        commissionPercentageInProducts: formData.commissionPercentageInProducts ? parseFloat(formData.commissionPercentageInProducts) : undefined
      })
      router.push("/owners")
    } catch (error) {
      console.error("Error creating owner:", error)
      // Here you might want to show an error message to the user
    }
  }

  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/owners">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Add New Owner</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Owner Information</CardTitle>
              <CardDescription>Enter the details of the new consignment owner.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="initial">Initial</Label>
                  <Input 
                    id="initial" 
                    name="initial" 
                    value={formData.initial} 
                    onChange={handleChange} 
                    required 
                    maxLength={3}
                    placeholder="ABC"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commissionPercentageInCash">Cash Commission %</Label>
                  <Input 
                    id="commissionPercentageInCash" 
                    name="commissionPercentageInCash" 
                    type="number" 
                    value={formData.commissionPercentageInCash} 
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commissionPercentageInProducts">Product Commission %</Label>
                  <Input 
                    id="commissionPercentageInProducts" 
                    name="commissionPercentageInProducts" 
                    type="number" 
                    value={formData.commissionPercentageInProducts} 
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={3} />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional information about this owner"
                  rows={3}
                />
              </div> */}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href="/owners">Cancel</Link>
              </Button>
              <Button type="submit">Save Owner</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}
