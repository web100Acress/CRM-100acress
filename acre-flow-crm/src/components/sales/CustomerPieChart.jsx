import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CustomerPieChart = () => (
  <div className="w-24 h-24">
    <CircularProgressbar
      value={65}
      text="65%"
      styles={buildStyles({
        pathColor: '#6C5DD3',
        textColor: '#111',
        trailColor: '#eee',
      })}
    />
  </div>
);

export default CustomerPieChart;
    