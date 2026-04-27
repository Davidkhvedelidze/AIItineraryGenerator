import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ExampleItinerary() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight">Example itinerary preview</h2>
        <Card>
          <CardHeader>
            <CardTitle>4-Day Georgia Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Day 1:</strong> Explore Tbilisi Old Town, sulfur baths, and local cuisine.</p>
            <p><strong className="text-foreground">Day 2:</strong> Day trip to Kakheti wine region with scenic stops.</p>
            <p><strong className="text-foreground">Day 3:</strong> Mountain route to Kazbegi with viewpoints and hikes.</p>
            <p><strong className="text-foreground">Day 4:</strong> Cultural landmarks, shopping, and evening farewell dinner.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
