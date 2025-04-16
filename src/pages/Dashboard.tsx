import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "@/contexts/ItemsContext";
import { ItemStatus } from "@/types";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Package, Check, RotateCcw, Search } from "lucide-react";
import ItemCard from "@/components/ItemCard";

const Dashboard = () => {
  const { items } = useItems();
  const navigate = useNavigate();
  
  const foundItems = items.filter(item => item.status === ItemStatus.FOUND);
  const claimedItems = items.filter(item => item.status === ItemStatus.CLAIMED);
  const returnedItems = items.filter(item => item.status === ItemStatus.RETURNED);
  
  const statusData = [
    { name: "Found", value: foundItems.length, color: "#22c55e" },
    { name: "Claimed", value: claimedItems.length, color: "#3b82f6" },
    { name: "Returned", value: returnedItems.length, color: "#6b7280" },
  ];

  const categoryData = Array.from(
    items.reduce((acc, item) => {
      acc.set(item.category, (acc.get(item.category) || 0) + 1);
      return acc;
    }, new Map<string, number>())
  ).map(([name, value]) => ({ name, value }));

  // Get recent items (last 5)
  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="container py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <PageTitle 
          title="Dashboard" 
          subtitle="Welcome to VJTI Lost & Found system" 
        />
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <Button 
            onClick={() => navigate("/items")}
            className="gap-2"
          >
            <Search size={16} />
            Browse Items
          </Button>
          <Button 
            onClick={() => navigate("/report-found")}
            variant="secondary"
            className="gap-2"
          >
            <Package size={16} />
            Report Found
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Found</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{foundItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Items waiting to be claimed
            </p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Claimed</CardTitle>
            <Check className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claimedItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Items successfully claimed
            </p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Returned</CardTitle>
            <RotateCcw className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{returnedItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Items returned to owners
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Chart */}
        <Card className="glass col-span-1">
          <CardHeader>
            <CardTitle>Items by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Chart */}
        <Card className="glass col-span-1">
          <CardHeader>
            <CardTitle>Items by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fill: '#a1a1aa', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#a1a1aa' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(23, 23, 23, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="value" fill="rgba(147, 51, 234, 0.7)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Items */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recently Reported Items</h2>
          <Button 
            variant="link" 
            onClick={() => navigate("/items")}
            className="text-primary"
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
