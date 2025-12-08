import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { BreadcrumbItem } from "@/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Users,
  Award,
  Shield,
  UserPlus,
} from "lucide-react";

import ModernPie from "./ModernPie";
import RevenueChart from "./RevenueChart";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: dashboard().url },
];

interface DashboardProps {
  totalResidents: number;
  genderCounts: Record<string, number>;
  zoneData: { name: string; value: number }[];
  youthCount: number;
  approvedYouthByGender: { gender: string; count: number }[];

  totalGrantedScholars: number;
  seniorCitizenCount: number;

  dailyRevenue: {
    date: string;
    total: number;
    transactions: number;
  }[];

  // ⭐ Today’s revenue summary
  todayRevenueTotal: number;
  todayRevenueTransactions: number;
}

export default function Dashboard({
  totalResidents,
  genderCounts,
  zoneData,
  approvedYouthByGender,
  totalGrantedScholars,
  seniorCitizenCount,
  dailyRevenue,
  todayRevenueTotal,
  todayRevenueTransactions,
}: DashboardProps) {
  const genderData = Object.entries(genderCounts).map(
    ([gender, value]) => ({ name: gender, value })
  );

  const youthGenderData = approvedYouthByGender.map((item) => ({
    name: item.gender || "Unknown",
    value: item.count,
  }));

  const totalYouth = youthGenderData.reduce((sum, x) => sum + x.value, 0);

  // SUMMARY (Last 30 days)
  const totalRevenueAmount = dailyRevenue.reduce(
    (sum, r) => sum + r.total,
    0
  );

  const totalTransactions = dailyRevenue.reduce(
    (sum, r) => sum + r.transactions,
    0
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      {/* Header */}
      <div className="px-6 py-6">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Barangay Dashboard
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Official real-time barangay demographic, revenue, and youth development data
        </p>
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-6 mb-6">

        <Card className="border bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={22} /> Residents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalResidents}</p>
            <p className="text-xs opacity-80">Population Count</p>
          </CardContent>
        </Card>

        <Card className="border bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus size={22} /> Youth Members (15–30)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalYouth}</p>
            <p className="text-xs opacity-80">Registered Youth</p>
          </CardContent>
        </Card>

        <Card className="border bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award size={22} /> Scholars Granted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalGrantedScholars}</p>
            <p className="text-xs opacity-80">Scholarship Beneficiaries</p>
          </CardContent>
        </Card>

        <Card className="border bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={22} /> Senior Citizens (60+)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{seniorCitizenCount}</p>
            <p className="text-xs opacity-80">Approved Seniors</p>
          </CardContent>
        </Card>

      </div>

      {/* ⭐ Revenue Summary (Today + Last 30 Days) */}
      <div className="px-6 mb-4">
        <div className="bg-white border rounded-xl shadow-sm p-4 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Today’s Revenue */}
          <div>
            <p className="text-sm text-gray-500">Today&apos;s Revenue</p>
            <p className="text-2xl font-bold text-blue-700">
              ₱{todayRevenueTotal.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {todayRevenueTransactions} transaction
              {todayRevenueTransactions === 1 ? "" : "s"} today
            </p>
          </div>

          {/* Last 30 Days */}
          <div>
            <p className="text-sm text-gray-500">Last 30 Days Revenue</p>
            <p className="text-2xl font-bold text-emerald-700">
              ₱{totalRevenueAmount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {totalTransactions} transaction
              {totalTransactions === 1 ? "" : "s"} in the last 30 days
            </p>
          </div>

        </div>
      </div>

      {/* Daily Revenue Chart */}
      <div className="px-6 mb-8">
        <Card className="shadow-md border">
          <CardHeader>
            <CardTitle>Daily Revenue (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={dailyRevenue} />
          </CardContent>
        </Card>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-10">

        <Card className="shadow-md border">
          <CardContent>
            <ModernPie title="Gender Distribution (Residents)" data={genderData} />
          </CardContent>
        </Card>

        <Card className="shadow-md border">
          <CardContent>
            <ModernPie title="Population Distribution by Zone" data={zoneData} />
          </CardContent>
        </Card>

        <Card className="shadow-md border">
          <CardContent>
            <ModernPie title="Approved Youth by Gender" data={youthGenderData} />
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
