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
}

export default function Dashboard({
  totalResidents,
  genderCounts,
  zoneData,
  approvedYouthByGender,
  totalGrantedScholars,
  seniorCitizenCount,
}: DashboardProps) {
  const genderData = Object.entries(genderCounts).map(
    ([gender, value]) => ({ name: gender, value })
  );

  const youthGenderData = approvedYouthByGender.map((item, i) => ({
    name: item.gender || "Unknown",
    value: item.count,
  }));

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      {/* Header */}
      <div className="px-6 py-6">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Barangay Dashboard
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Official real-time barangay demographic and youth development data
        </p>
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-6 mb-6">

        {/* Total Residents */}
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

        {/* Youth Count */}
        <Card className="border bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus size={22} /> Youth Members (15–30)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {youthGenderData.reduce((sum, x) => sum + x.value, 0)}
            </p>
            <p className="text-xs opacity-80">Registered Youth</p>
          </CardContent>
        </Card>

        {/* Scholars Granted */}
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

        {/* Seniors */}
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

      {/* Modern Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-10">

        <Card className="shadow-md border">
          <CardContent>
            <ModernPie
              title="Gender Distribution (Residents)"
              data={genderData}
            />
          </CardContent>
        </Card>

        <Card className="shadow-md border">
          <CardContent>
            <ModernPie
              title="Population Distribution by Zone"
              data={zoneData}
            />
          </CardContent>
        </Card>

        <Card className="shadow-md border">
          <CardContent>
            <ModernPie
              title="Approved Youth by Gender"
              data={youthGenderData}
            />
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
