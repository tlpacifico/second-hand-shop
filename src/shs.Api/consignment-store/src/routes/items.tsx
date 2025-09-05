import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Package, Plus } from "lucide-react"

export const Route = createFileRoute('/items')({
  component: ItemsPage,
})

function ItemsPage() {
  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Items</h1>
            <p className="text-muted-foreground">Manage your consignment items.</p>
          </div>
          <Button asChild>
            <Link to="/items/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Item Inventory</CardTitle>
            <CardDescription>View and manage all consignment items.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <Package className="mr-2 h-4 w-4" />
              No items found
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
