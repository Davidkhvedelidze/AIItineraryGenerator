"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ItineraryDay } from "@/types/trip";

interface ItineraryDayCardProps {
  dayData: ItineraryDay;
}

function ItineraryDayCardComponent({ dayData }: ItineraryDayCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Day {dayData.day}: {dayData.title}</CardTitle>
        <p className="text-sm text-muted-foreground">Region: {dayData.region}</p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p><strong>Morning:</strong> {dayData.morning}</p>
        <p><strong>Afternoon:</strong> {dayData.afternoon}</p>
        <p><strong>Evening:</strong> {dayData.evening}</p>
        <p><strong>Food:</strong> {dayData.foodSuggestion}</p>
        <p><strong>Travel tip:</strong> {dayData.travelTip}</p>
      </CardContent>
    </Card>
  );
}

export const ItineraryDayCard = memo(ItineraryDayCardComponent);
