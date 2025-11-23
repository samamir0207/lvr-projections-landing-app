import SeasonalityTable from '../SeasonalityTable';

export default function SeasonalityTableExample() {
  return (
    <SeasonalityTable 
      peak={{ daysBooked: 16, daysAvailable: 16, occupancy: 1.0, adr: 947 }}
      winter={{ daysBooked: 79, daysAvailable: 79, occupancy: 0.49, adr: 403 }}
      highDemand={{ daysBooked: 71, daysAvailable: 99, occupancy: 0.71, adr: 875 }}
      highShoulder={{ daysBooked: 11, daysAvailable: 71, occupancy: 0.11, adr: 683 }}
      lowShoulder={{ daysBooked: 57, daysAvailable: 99, occupancy: 0.57, adr: 583 }}
    />
  );
}
