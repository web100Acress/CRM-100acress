import { useDashboardStats } from "@/hooks/useDashboardStats";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, ResponsiveContainer } from "recharts";

const DynamicDashboard = ({ userRole, userId: propUserId }) => {
  // Get userId from localStorage if not provided as a prop
  const userId = propUserId || localStorage.getItem("userId");
  const { stats, loading, error } = useDashboardStats(userRole, userId);

  // Show loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
        <div>Loading dashboard data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
        <div>Error loading dashboard: {error}</div>
      </div>
    );
  }

  // Show no data state
  if (!stats) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
        <div>No dashboard data available</div>
      </div>
    );
  }

  return (
    <>
      {/* Real-time Role Stats UI Block */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1.5rem",
          margin: "24px 0",
          padding: "16px",
          background: "#f8fafc",
          borderRadius: "1rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {userRole === "super-admin" && (
          <>
            <StatCard
              label="Total Leads"
              value={stats.totalLeads}
              color="#2563eb"
              chartType="pie"
              chartData={[
                { name: "Leads", value: stats.totalLeads, fill: "#2563eb" }
              ]}
            />
            <StatCard
              label="Active Users"
              value={stats.activeUsers}
              color="#10b981"
              chartType="bar"
              chartData={[
                { name: "Active", value: stats.activeUsers }
              ]}
            />
            <StatCard
              label="Open Tickets"
              value={stats.openTickets}
              color="#f59e42"
              chartType="line"
              chartData={[
                { name: "Now", value: stats.openTickets }
              ]}
            />
            <StatCard
              label="Monthly Revenue"
              value={`₹${(stats.monthlyRevenue/1e7).toFixed(2)} Cr`}
              color="#a78bfa"
              chartType="bar"
              chartData={[
                { name: "Now", value: (stats.monthlyRevenue/1e7) }
              ]}
            />
          </>
        )}
        {(userRole === "head-admin" || userRole === "head") && (
          <>
            <StatCard
              label="Managed Leads"
              value={stats.managedLeads}
              color="#2563eb"
              chartType="pie"
              chartData={[
                { name: "Managed", value: stats.managedLeads, fill: "#2563eb" }
              ]}
            />
            <StatCard
              label="Total Teams"
              value={stats.totalTeams}
              color="#10b981"
              chartType="bar"
              chartData={[
                { name: "Teams", value: stats.totalTeams }
              ]}
            />
            <StatCard
              label="Pending Approvals"
              value={stats.pendingApprovals}
              color="#f59e42"
              chartType="line"
              chartData={[
                { name: "Now", value: stats.pendingApprovals }
              ]}
            />
            <StatCard
              label="Overall Conversion"
              value={`${stats.overallConversion}%`}
              color="#a78bfa"
              chartType="bar"
              chartData={[
                { name: "Now", value: stats.overallConversion }
              ]}
            />
          </>
        )}
          {userRole === "team-leader" && (
          <>
            <StatCard
              label="My Team Leads"
              value={stats.myTeamLeads}
              color="#2563eb"
              chartType="pie"
              chartData={[
                { name: "Team Leads", value: stats.myTeamLeads, fill: "#2563eb" }
              ]}
            />
            <StatCard
              label="Team Size"
              value={stats.teamSize}
              color="#10b981"
              chartType="bar"
              chartData={[
                { name: "Size", value: stats.teamSize }
              ]}
            />
            <StatCard
              label="My Pending Tasks"
              value={stats.myPendingTasks}
              color="#f59e42"
              chartType="line"
              chartData={[
                { name: "Now", value: stats.myPendingTasks }
              ]}
            />
            <StatCard
              label="Team Target Achieved"
              value={`₹${stats.teamTargetAchieved/1e5}L`}
              color="#a78bfa"
              chartType="bar"
              chartData={[
                { name: "Now", value: (stats.teamTargetAchieved/1e5) }
              ]}
            />
          </>
        )}
        {userRole === "employee" && (
          <>
            <StatCard
              label="Assigned Leads"
              value={stats.assignedLeads}
              color="#2563eb"
              chartType="pie"
              chartData={[
                { name: "Assigned", value: stats.assignedLeads, fill: "#2563eb" }
              ]}
            />
            <StatCard
              label="Today's Follow-ups"
              value={stats.todaysFollowups}
              color="#10b981"
              chartType="bar"
              chartData={[
                { name: "Today", value: stats.todaysFollowups }
              ]}
            />
            <StatCard
              label="My Open Tickets"
              value={stats.myOpenTickets}
              color="#f59e42"
              chartType="line"
              chartData={[
                { name: "Now", value: stats.myOpenTickets }
              ]}
            />
            <StatCard
              label="Monthly Target Progress"
              value={`${stats.monthlyTargetProgress}%`}
              color="#a78bfa"
              chartType="bar"
              chartData={[
                { name: "Now", value: stats.monthlyTargetProgress }
              ]}
            />
          </>
        )}
      </div>
    </>
  );
};

export default DynamicDashboard;

function StatCard({ label, value, color, chartType, chartData }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "0.75rem",
        padding: "18px 14px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        borderLeft: `5px solid ${color}`,
        minHeight: 100,
        position: "relative",
      }}
    >
      <div style={{ fontSize: 14, color: "#64748b", fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, marginBottom: 8 }}>{value}</div>
      <div style={{ width: 60, height: 40, position: "absolute", right: 10, bottom: 10 }}>
        {chartType === "pie" && chartData && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={18}
                innerRadius={10}
                fill={color}
              >
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.fill || color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
        {chartType === "bar" && chartData && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <Bar dataKey="value" fill={color} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        )}
        {chartType === "line" && chartData && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
