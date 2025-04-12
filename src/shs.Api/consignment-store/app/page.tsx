import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, ClipboardList, DollarSign } from "lucide-react"

export default function Dashboard() {
  // Stats would typically come from a database
  const stats = {
    totalOwners: 24,
    totalItems: 156,
    pendingReview: 12,
    recentSales: 8,
    monthlyRevenue: "$2,450",
  }

  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your consignment store inventory and owners.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Owners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOwners}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItems}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReview}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthlyRevenue}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for your store</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button asChild className="w-full justify-start">
                <Link href="/owners/new">
                  <Users className="mr-2 h-4 w-4" />
                  Register New Owner
                </Link>
              </Button>
              <Button asChild className="w-full justify-start">
                <Link href="/items/new">
                  <Package className="mr-2 h-4 w-4" />
                  Add New Items
                </Link>
              </Button>
              <Button asChild className="w-full justify-start">
                <Link href="/consignments/review">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Review Pending Items
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest consignments and sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-primary/10 p-2">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">New consignment from Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">12 items received for review</p>
                  </div>
                  <div className="text-sm text-muted-foreground">2h ago</div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-green-500/10 p-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Vintage lamp sold</p>
                    <p className="text-sm text-muted-foreground">Owner: Michael Smith</p>
                  </div>
                  <div className="text-sm text-muted-foreground">5h ago</div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-primary/10 p-2">
                    <ClipboardList className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Report sent to David Wilson</p>
                    <p className="text-sm text-muted-foreground">8 items accepted for consignment</p>
                  </div>
                  <div className="text-sm text-muted-foreground">1d ago</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
