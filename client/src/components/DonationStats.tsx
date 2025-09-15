import { TrendingUp, Users, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DonationStatsProps {
  totalRaised: string;
  donorCount: number;
  impactMetric?: string;
}

export default function DonationStats({ totalRaised, donorCount, impactMetric }: DonationStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
      <Card className="p-8 text-center hover-elevate" data-testid="card-total-raised">
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <TrendingUp className="w-8 h-8 text-primary" data-testid="icon-trending" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground" data-testid="text-amount">{totalRaised}</p>
            <p className="text-sm font-medium text-muted-foreground">Total Raised</p>
          </div>
        </div>
      </Card>

      <Card className="p-8 text-center hover-elevate" data-testid="card-donors">
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-chart-2/10 rounded-full">
            <Users className="w-8 h-8 text-chart-2" data-testid="icon-users" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground" data-testid="text-donor-count">{donorCount}</p>
            <p className="text-sm font-medium text-muted-foreground">Generous Donors</p>
          </div>
        </div>
      </Card>

      <Card className="p-8 text-center hover-elevate" data-testid="card-impact">
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-chart-3/10 rounded-full">
            <Heart className="w-8 h-8 text-chart-3" data-testid="icon-impact" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground" data-testid="text-impact">{impactMetric || "25+"}</p>
            <p className="text-sm font-medium text-muted-foreground">Projects Funded</p>
          </div>
        </div>
      </Card>
    </div>
  );
}