import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface ProjectionRun {
  id: number;
  slug: string;
  aeSlug: string;
  aeName: string | null;
  aeEmail: string | null;
  leadId: string | null;
  lvrId: string | null;
  ownerName: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  market: string | null;
  publicUrl: string | null;
  previewUrl: string | null;
  gsheetUrl: string | null;
  action: string;
  createdAt: string;
}

interface RunsResponse {
  ok: boolean;
  count: number;
  runs: ProjectionRun[];
}

export default function AdminRunsPage() {
  const [limit, setLimit] = useState(100);

  const { data, isLoading, error, refetch } = useQuery<RunsResponse>({
    queryKey: ["admin-runs", limit],
    queryFn: async () => {
      const res = await fetch(`/api/admin/runs?limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch runs");
      return res.json();
    },
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const exportToCsv = () => {
    if (!data?.runs) return;

    const headers = [
      "Run Date",
      "Action",
      "Team Member Name",
      "Team Member Email",
      "Owner Name",
      "Address",
      "City",
      "State",
      "Market",
      "LVR ID",
      "Lead ID",
      "Public URL",
      "Preview URL",
      "Google Sheet URL",
    ];

    const rows = data.runs.map((run) => [
      formatDate(run.createdAt),
      run.action,
      run.aeName || "",
      run.aeEmail || "",
      run.ownerName || "",
      run.address || "",
      run.city || "",
      run.state || "",
      run.market || "",
      run.lvrId || "",
      run.leadId || "",
      run.publicUrl || "",
      run.previewUrl || "",
      run.gsheetUrl || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `projection-runs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Projection Runs Log
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              History of all projection creates and updates
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value={50}>Last 50</option>
              <option value={100}>Last 100</option>
              <option value={250}>Last 250</option>
              <option value={500}>Last 500</option>
            </select>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Refresh
            </button>
            <button
              onClick={exportToCsv}
              className="px-4 py-2 text-sm bg-[#d4bda2] hover:bg-[#c4ad92] text-white rounded-md"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {isLoading && (
          <div className="text-center py-12 text-gray-500">Loading runs...</div>
        )}

        {error && (
          <div className="text-center py-12 text-red-500">
            Error loading runs: {String(error)}
          </div>
        )}

        {data && (
          <>
            <div className="mb-4 text-sm text-gray-500">
              Showing {data.count} runs
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team Member
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Market
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        LVR ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Links
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.runs.map((run) => (
                      <tr key={run.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(run.createdAt)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              run.action === "create"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {run.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="text-gray-900">{run.aeName}</div>
                          <div className="text-gray-500 text-xs">
                            {run.aeEmail}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {run.ownerName}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="text-gray-900 max-w-xs truncate">
                            {run.address}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {run.city}, {run.state}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {run.market || "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {run.lvrId || "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            {run.publicUrl && (
                              <a
                                href={run.publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                View
                              </a>
                            )}
                            {run.previewUrl && (
                              <a
                                href={run.previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-gray-700 underline"
                              >
                                Preview
                              </a>
                            )}
                            {run.gsheetUrl && (
                              <a
                                href={run.gsheetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-800 underline"
                              >
                                Sheet
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {data.runs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No projection runs logged yet. Runs will appear here when
                projections are created or updated via the API.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
