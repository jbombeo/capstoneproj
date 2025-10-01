import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout-sk';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
];

// Sample data
const populationData = [
  { name: 'Male', value: 400 },
  { name: 'Female', value: 600 },
];

const blotterData = [
  { name: 'Jan', count: 10 },
  { name: 'Feb', count: 15 },
  { name: 'Mar', count: 8 },
  { name: 'Apr', count: 20 },
];

const zoneData = [
  { name: 'Zone 1', value: 100 },
  { name: 'Zone 2', value: 80 },
  { name: 'Zone 3', value: 150 },
  { name: 'Zone 4', value: 70 },
];

const revenueData = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 2500 },
  { month: 'Apr', revenue: 4000 },
];

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28'];

export default function Dashboard() {
  return (  
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {/* Population Chart */}
        <Card>
<CardHeader className=" border-gray-200 pb-2">
  <CardTitle className="text-s font-bold text-emerald-800">
    Population (Male vs Female)
  </CardTitle>
</CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={populationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {populationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Blotters Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Blotters</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer>
              <BarChart data={blotterData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Zone Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Population by Zone</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={zoneData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {zoneData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenues */}
        <Card>
          <CardHeader>
            <CardTitle>Revenues</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer>
              <LineChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#00C49F" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
