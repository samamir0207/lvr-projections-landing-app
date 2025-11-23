import CredibilityBar from '../CredibilityBar';

export default function CredibilityBarExample() {
  return (
    <CredibilityBar 
      homeownerSatisfaction="98%"
      guestReviews="10,000+"
      higherRevenue="25%"
      localTeam={true}
    />
  );
}
