import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Mail } from "lucide-react"

// Mock data - would come from a database in a real application
const reports = [
  {
    id: "REP001",
    type: "Consignment Review",
    owner: "Sarah Johnson",
    date: "2023-04-15",
    status: "Sent",
  },
  {
    id: "REP002",
    type: "Monthly Statement",
    owner: "Michael Smith",
    date: "2023-04-01",
    status: "Sent",
  },
  {
    id: "REP003",
    type: "Sales Report",
    owner: "David Wilson",
    date: "2023-03-31",
    status: "Draft",
  },
  {
    id: "REP004",
    type: "Consignment Review",
    owner: "Emily Brown",
    date: "2023-04-05",
    status: "Sent",
  },
  {
    id: "REP005",
    type: "Monthly Statement",
    owner: "Jessica Davis",
    date: "2023-04-01",
    status: "Sent",
  },
]

export default function ReportsPage() {
  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Generate and manage reports for owners.</p>
          </div>
          <Button asChild>
            <Link href="/reports/new">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Consignment Reviews</CardTitle>
              <CardDescription>Reports sent after reviewing items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Monthly Statements</CardTitle>
              <CardDescription>Monthly sales reports for owners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Sales Reports</CardTitle>
              <CardDescription>Detailed sales analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>View and manage generated reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-mono text-sm">{report.id}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell className="font-medium">{report.owner}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>
                      <Badge variant={report.status === "Sent" ? "default" : "outline"}>{report.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/reports/${report.id}`}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Link>
                      </Button>
                      {report.status === "Draft" && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/reports/${report.id}/send`}>
                            <Mail className="mr-2 h-4 w-4" />
                            Send
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
