import { useRoleDashboardStats } from "@/hooks/useRoleDashboardStats";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, ResponsiveContainer } from "recharts";

const DynamicDashboard = ({ userRole, userId: propUserId }) => {
  // Get userId from localStorage if not provided as a prop
  const userId = propUserId || localStorage.getItem("userId");
  const roleStats = useRoleDashboardStats(userRole, userId);

  return (
    <>
      {/* Real-time Role Stats UI Block */}
      {roleStats && (
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
                value={roleStats.totalLeads}
                color="#2563eb"
                chartType="pie"
                chartData={[
                  { name: "Leads", value: roleStats.totalLeads, fill: "#2563eb" }
                ]}
              />
              <StatCard
                label="Active Users"
                value={roleStats.activeUsers}
                color="#10b981"
                chartType="bar"
                chartData={[
                  { name: "Active", value: roleStats.activeUsers }
                ]}
              />
              <StatCard
                label="Open Tickets"
                value={roleStats.openTickets}
                color="#f59e42"
                chartType="line"
                chartData={[
                  { name: "Now", value: roleStats.openTickets }
                ]}
              />
              <StatCard
                label="Monthly Revenue"
                value={`₹${(roleStats.monthlyRevenue/1e7).toFixed(2)} Cr`}
                color="#a78bfa"
                chartType="bar"
                chartData={[
                  { name: "Now", value: (roleStats.monthlyRevenue/1e7) }
                ]}
              />
            </>
          )}
          {userRole === "head-admin" && (
            <>
              <StatCard
                label="Managed Leads"
                value={roleStats.managedLeads}
                color="#2563eb"
                chartType="pie"
                chartData={[
                  { name: "Managed", value: roleStats.managedLeads, fill: "#2563eb" }
                ]}
              />
              <StatCard
                label="Total Teams"
                value={roleStats.totalTeams}
                color="#10b981"
                chartType="bar"
                chartData={[
                  { name: "Teams", value: roleStats.totalTeams }
                ]}
              />
              <StatCard
                label="Pending Approvals"
                value={roleStats.pendingApprovals}
                color="#f59e42"
                chartType="line"
                chartData={[
                  { name: "Now", value: roleStats.pendingApprovals }
                ]}
              />
              <StatCard
                label="Overall Conversion"
                value={`${roleStats.overallConversion}%`}
                color="#a78bfa"
                chartType="bar"
                chartData={[
                  { name: "Now", value: roleStats.overallConversion }
                ]}
              />
            </>
          )}
          {userRole === "team-leader" && (
            <>
              <StatCard
                label="My Team Leads"
                value={roleStats.myTeamLeads}
                color="#2563eb"
                chartType="pie"
                chartData={[
                  { name: "Team Leads", value: roleStats.myTeamLeads, fill: "#2563eb" }
                ]}
              />
              <StatCard
                label="Team Size"
                value={roleStats.teamSize}
                color="#10b981"
                chartType="bar"
                chartData={[
                  { name: "Size", value: roleStats.teamSize }
                ]}
              />
              <StatCard
                label="My Pending Tasks"
                value={roleStats.myPendingTasks}
                color="#f59e42"
                chartType="line"
                chartData={[
                  { name: "Now", value: roleStats.myPendingTasks }
                ]}
              />
              <StatCard
                label="Team Target Achieved"
                value={`₹${roleStats.teamTargetAchieved/1e5}L`}
                color="#a78bfa"
                chartType="bar"
                chartData={[
                  { name: "Now", value: (roleStats.teamTargetAchieved/1e5) }
                ]}
              />
            </>
          )}
          {userRole === "employee" && (
            <>
              <StatCard
                label="Assigned Leads"
                value={roleStats.assignedLeads}
                color="#2563eb"
                chartType="pie"
                chartData={[
                  { name: "Assigned", value: roleStats.assignedLeads, fill: "#2563eb" }
                ]}
              />
              <StatCard
                label="Today's Follow-ups"
                value={roleStats.todaysFollowups}
                color="#10b981"
                chartType="bar"
                chartData={[
                  { name: "Today", value: roleStats.todaysFollowups }
                ]}
              />
              <StatCard
                label="My Open Tickets"
                value={roleStats.myOpenTickets}
                color="#f59e42"
                chartType="line"
                chartData={[
                  { name: "Now", value: roleStats.myOpenTickets }
                ]}
              />
              <StatCard
                label="Monthly Target Progress"
                value={`${roleStats.monthlyTargetProgress}%`}
                color="#a78bfa"
                chartType="bar"
                chartData={[
                  { name: "Now", value: roleStats.monthlyTargetProgress }
                ]}
              />
            </>
          )}
        </div>
      )}
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
