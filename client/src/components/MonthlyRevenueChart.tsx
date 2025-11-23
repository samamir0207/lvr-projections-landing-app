import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface MonthlyRevenueChartProps {
  monthlyRevenue: {
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
  };
}

export default function MonthlyRevenueChart({ monthlyRevenue }: MonthlyRevenueChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const data = [
      monthlyRevenue.jan,
      monthlyRevenue.feb,
      monthlyRevenue.mar,
      monthlyRevenue.apr,
      monthlyRevenue.may,
      monthlyRevenue.jun,
      monthlyRevenue.jul,
      monthlyRevenue.aug,
      monthlyRevenue.sep,
      monthlyRevenue.oct,
      monthlyRevenue.nov,
      monthlyRevenue.dec
    ];

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Monthly Revenue',
          data: data,
          backgroundColor: 'hsl(32, 34%, 73%)',
          borderColor: 'hsl(32, 34%, 65%)',
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return '$' + (context.parsed.y ?? 0).toLocaleString();
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              },
              color: 'hsl(210, 2%, 39%)'
            },
            grid: {
              color: 'hsl(0, 0%, 92%)'
            }
          },
          x: {
            ticks: {
              color: 'hsl(210, 2%, 39%)'
            },
            grid: {
              display: false
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [monthlyRevenue]);

  return (
    <section className="py-16 md:py-24 bg-card border-y border-border" data-testid="section-monthly-revenue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4" data-testid="heading-monthly-revenue">
          Monthly Revenue Breakdown
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Projected revenue by month based on historical market performance
        </p>

        <div className="bg-background p-6 rounded-md max-w-5xl mx-auto">
          <canvas ref={chartRef} data-testid="chart-monthly-revenue"></canvas>
        </div>
      </div>
    </section>
  );
}
