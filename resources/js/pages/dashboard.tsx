import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28'];

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: dashboard().url },
];

interface DashboardProps {
  totalResidents: number;
  genderCounts: Record<string, number>;
  zoneData: { name: string; value: number }[];
}

export default function Dashboard({ totalResidents, genderCounts, zoneData }: DashboardProps) {
  const genderData = Object.entries(genderCounts).map(([gender, value]) => ({ name: gender, value }));

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {/* Combined Total + Gender Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Total Residents & Gender Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-emerald-700 mb-4">{totalResidents}</span>
            <div className="w-full h-48">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => `${name}: ${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Population by Zone */}
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
                  dataKey="value"
                  label
                >
                  {zoneData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
