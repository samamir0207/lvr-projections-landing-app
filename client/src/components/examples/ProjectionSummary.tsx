import ProjectionSummary from '../ProjectionSummary';

export default function ProjectionSummaryExample() {
  return (
    <ProjectionSummary 
      expectedRevenue={111849}
      highRevenue={134219}
      lowRevenue={89479}
      disclaimer="These projections are based on historical performance of comparable properties, market seasonality trends, and LocalVR's pricing algorithm. Actual results may vary."
      ctaUrl="https://calendly.com/kaci-wolkers"
    />
  );
}
