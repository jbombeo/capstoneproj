import { Head, Link, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import SKLayout from "./layout";
import {
  Search,
  Filter,
  Eye,
  Trash2,
  FileText,
  User as UserIcon,
  MessageSquare,
} from "lucide-react";

type RequestStatus = "pending" | "approved" | "rejected" | "resolved";

interface RequestItem {
  id: number;
  category: string;
  message: string;
  status: RequestStatus;
  remarks: string | null;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface RequestsPageProps extends InertiaPageProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  requests?: RequestItem[];
}

export default function Requests() {
  const { user, requests = [] } = usePage<RequestsPageProps>().props;

  const statusBadge = (status: RequestStatus) =>
    status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : status === "approved"
      ? "bg-green-100 text-green-700"
      : status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-blue-100 text-blue-700";

  return (
    <SKLayout>
      <Head title="Service Requests" />

      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Service Requests</h2>
              <p className="text-sm text-gray-600 mt-1">
                Requests submitted by registered youth members
              </p>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button className="px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-semibold">
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-700">Request</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-700">Remarks</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-700">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-gray-500 text-sm">
                      No service requests found.
                    </td>
                  </tr>
                ) : (
                  requests.map((r) => (
                    <tr key={r.id} className="hover:bg-blue-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{r.category}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{r.message}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <UserIcon className="w-3 h-3" />
                              {r.user.name} ({r.user.email})
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-full ${statusBadge(
                            r.status
                          )}`}
                        >
                          {r.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {r.remarks ?? "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {r.created_at}
                      </td>

                      <td className="px-6 py-4 text-sm flex gap-3">
                        <Link
                          href={`/sk/requests/${r.id}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>

                        <Link
                          as="button"
                          method="delete"
                          href={`/sk/requests/${r.id}`}
                          className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                          onClick={(e) => {
                            if (!confirm("Are you sure you want to delete this request?")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
            Showing {requests.length} service requests
          </div>
        </div>
      </div>
    </SKLayout>
  );
}
