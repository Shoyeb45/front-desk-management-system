// src/app/dashboard/page.tsx (or wherever)
import { ThemeToggle } from '@/components/theme-toggle';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-background-secondary border-b border-border px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">
            Clinic Dashboard
          </h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Primary Button */}
        <button className="bg-primary hover:bg-primary-600 
                         text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Add New Patient
        </button>

        {/* Secondary Button */}
        <button className="bg-secondary hover:bg-secondary-600 
                         text-white px-4 py-2 rounded-lg font-medium transition-colors ml-2">
          Create Appointment
        </button>

        {/* Card */}
        <div className="bg-background-secondary border border-border 
                      rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Patient Queue
          </h2>
          <p className="text-foreground-secondary">
            3 patients waiting
          </p>
          <div className="mt-4 pt-4 border-t border-border-divider">
            <p className="text-foreground-muted text-sm">
              Last updated: 2 minutes ago
            </p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex gap-2">
          <span className="bg-success text-white px-3 py-1 rounded-full text-sm">
            Completed
          </span>
          <span className="bg-warning text-white px-3 py-1 rounded-full text-sm">
            Pending
          </span>
          <span className="bg-danger text-white px-3 py-1 rounded-full text-sm">
            Urgent
          </span>
          <span className="bg-info text-white px-3 py-1 rounded-full text-sm">
            Info
          </span>
        </div>

        {/* Input Field */}
        <div className="space-y-2">
          <label className="block text-foreground-secondary text-sm font-medium">
            Patient Name
          </label>
          <input
            type="text"
            placeholder="Enter patient name"
            className="w-full px-4 py-2 bg-background border border-border 
                     rounded-lg text-foreground placeholder:text-foreground-muted
                     focus:outline-none focus:ring-2 focus:ring-border-focus"
          />
        </div>

        {/* Table/List */}
        <div className="bg-background-secondary border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-background-tertiary border-b border-border-divider">
              <tr>
                <th className="px-4 py-3 text-left text-foreground font-semibold">
                  Patient
                </th>
                <th className="px-4 py-3 text-left text-foreground font-semibold">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-foreground font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border-divider hover:bg-background-tertiary">
                <td className="px-4 py-3 text-foreground">John Doe</td>
                <td className="px-4 py-3 text-foreground-secondary">10:30 AM</td>
                <td className="px-4 py-3">
                  <span className="bg-success text-white px-2 py-1 rounded text-xs">
                    Checked In
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-background-tertiary">
                <td className="px-4 py-3 text-foreground">Jane Smith</td>
                <td className="px-4 py-3 text-foreground-secondary">11:00 AM</td>
                <td className="px-4 py-3">
                  <span className="bg-warning text-white px-2 py-1 rounded text-xs">
                    Waiting
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}