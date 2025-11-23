interface SeasonData {
  daysBooked: number;
  daysAvailable: number;
  occupancy: number;
  adr: number;
}

interface SeasonalityTableProps {
  peak: SeasonData;
  winter: SeasonData;
  highDemand: SeasonData;
  highShoulder: SeasonData;
  lowShoulder: SeasonData;
}

export default function SeasonalityTable({ peak, winter, highDemand, highShoulder, lowShoulder }: SeasonalityTableProps) {
  const seasons = [
    { name: "Peak Season", data: peak },
    { name: "Winter", data: winter },
    { name: "High Demand", data: highDemand },
    { name: "High Shoulder", data: highShoulder },
    { name: "Low Shoulder", data: lowShoulder }
  ];

  return (
    <section className="py-16 md:py-24 bg-background" data-testid="section-seasonality">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4" data-testid="heading-seasonality">
          Seasonality Performance
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Understanding how your property performs across different seasons
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-background rounded-md" data-testid="table-seasonality">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="py-4 px-6 text-left font-semibold">Season</th>
                <th className="py-4 px-6 text-right font-semibold">Days Booked</th>
                <th className="py-4 px-6 text-right font-semibold">Days Available</th>
                <th className="py-4 px-6 text-right font-semibold">Occupancy %</th>
                <th className="py-4 px-6 text-right font-semibold">ADR</th>
              </tr>
            </thead>
            <tbody>
              {seasons.map((season, index) => (
                <tr 
                  key={index} 
                  className={index % 2 === 0 ? "bg-background" : "bg-card"}
                  data-testid={`row-season-${index}`}
                >
                  <td className="py-4 px-6 font-medium text-foreground" data-testid={`season-name-${index}`}>
                    {season.name}
                  </td>
                  <td className="py-4 px-6 text-right text-foreground" data-testid={`season-booked-${index}`}>
                    {season.data.daysBooked}
                  </td>
                  <td className="py-4 px-6 text-right text-foreground" data-testid={`season-available-${index}`}>
                    {season.data.daysAvailable}
                  </td>
                  <td className="py-4 px-6 text-right text-foreground" data-testid={`season-occupancy-${index}`}>
                    {(season.data.occupancy * 100).toFixed(0)}%
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-primary" data-testid={`season-adr-${index}`}>
                    ${season.data.adr.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
