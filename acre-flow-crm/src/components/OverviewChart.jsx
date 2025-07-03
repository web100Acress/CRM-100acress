import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', uv: 200 },
  { name: 'Feb', uv: 300 },
  { name: 'Mar', uv: 250 },
  { name: 'Apr', uv: 180 },
  { name: 'May', uv: 290 },
  { name: 'Jun', uv: 220 },
  { name: 'Jul', uv: 340 },
  { name: 'Aug', uv: 500 },
  { name: 'Sep', uv: 400 },
  { name: 'Oct', uv: 330 },
  { name: 'Nov', uv: 260 },
  { name: 'Dec', uv: 380 },
];

const OverviewChart = () => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={data}>
      <XAxis dataKey="name" />
      <Tooltip />
      <Bar dataKey="uv" fill="#6C5DD3" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export default OverviewChart;
