import DonationStats from '../DonationStats';

export default function DonationStatsExample() {
  return (
    <div className="p-8 bg-background">
      <DonationStats 
        totalRaised="R 24,360.50" 
        donorCount={30} 
        impactMetric="25+" 
      />
    </div>
  );
}