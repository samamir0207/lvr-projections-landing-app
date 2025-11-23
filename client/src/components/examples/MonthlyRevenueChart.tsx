import MonthlyRevenueChart from '../MonthlyRevenueChart';

export default function MonthlyRevenueChartExample() {
  return (
    <MonthlyRevenueChart 
      monthlyRevenue={{
        jan: 1784,
        feb: 3463,
        mar: 10767,
        apr: 9704,
        may: 13610,
        jun: 19261,
        jul: 22669,
        aug: 9491,
        sep: 6376,
        oct: 6751,
        nov: 3563,
        dec: 4409
      }}
    />
  );
}
