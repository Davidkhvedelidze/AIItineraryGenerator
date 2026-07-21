"use client";

import { useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Download,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  PlaneLanding,
  RefreshCcw,
  Sparkles,
  Utensils,
  WalletCards,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { printItinerary } from "@/lib/itinerary/printItinerary";
import type {
  ItineraryDay,
  ItineraryResult as ItineraryResultType,
  TripFormData,
} from "@/types/trip";

interface ItineraryResultProps {
  result: ItineraryResultType;
  formData: TripFormData;
  onReset: () => void;
}

type ActionHandlers = {
  onWhatsApp: () => void;
  onEmail: () => void;
  onDownload: () => void;
  onReset: () => void;
};

const whatsappPhoneNumber = "995551181358";
const emailBookingUrl =
  "mailto:info@mustseegeorgia.com?subject=Georgia%20Trip%20Booking%20Request&body=Hello%2C%0A%0AI%20would%20like%20help%20booking%20my%20Georgia%20trip.%0A";

function cleanText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanList(items?: string[]): string[] {
  return items?.map(cleanText).filter(Boolean) ?? [];
}

function formatLabel(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getUniqueRegions(days: ItineraryResultType["days"]): string[] {
  return Array.from(new Set(days.map((day) => cleanText(day.region)).filter(Boolean)));
}

function buildWhatsAppUrl(formData: TripFormData): string {
  const days = formData.days;
  const travelers = formData.travelers;
  const startingCity = formData.preferredCities[0] || formData.arrivalAirport;
  const interests = formData.interests.join(", ");
  const budget = formData.budget;
  const travelStyle = formData.travelStyle;
  const message =
    encodeURIComponent(`Hello, I generated a Georgia trip itinerary on TripMate Georgia.

Trip summary:
- Days: ${days}
- Travelers: ${travelers}
- Starting city: ${startingCity}
- Interests: ${interests}
- Budget: ${budget}
- Travel style: ${travelStyle}

Can you help me organize this private trip?`);

  return `https://wa.me/${whatsappPhoneNumber}?text=${message}`;
}

function ResultActionBar({
  onWhatsApp,
  onEmail,
  onDownload,
  onReset,
}: ActionHandlers) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Button
        type="button"
        onClick={onWhatsApp}
        className="h-11 rounded-full px-5 shadow-sm transition hover:-translate-y-0.5"
      >
        <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
        Request This Trip on WhatsApp
      </Button>
      <Button
        type="button"
        variant="inverse"
        onClick={onDownload}
        className="h-11 rounded-full px-5"
      >
        <Download className="mr-2 h-4 w-4" aria-hidden="true" />
        Download / Print PDF
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onEmail}
        className="h-11 rounded-full border-black/20 bg-white/25 px-5 text-stone-950 hover:bg-white/40 hover:text-stone-950"
      >
        <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
        Email request
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onReset}
        className="h-11 rounded-full px-5 text-stone-950/85 hover:bg-white/25 hover:text-stone-950"
      >
        <RefreshCcw className="mr-2 h-4 w-4" aria-hidden="true" />
        Create another trip
      </Button>
    </div>
  );
}

function TripSnapshotCards({
  formData,
  regions,
}: {
  formData: TripFormData;
  regions: string[];
}) {
  const startingCity = formData.preferredCities[0] || formData.arrivalAirport;
  const interests = formData.interests.map(formatLabel).join(", ");
  const snapshot = [
    { label: "Length", value: `${formData.days} ${formData.days === 1 ? "day" : "days"}`, icon: CalendarDays },
    { label: "Travelers", value: `${formData.travelers}`, icon: Users },
    { label: "Start", value: startingCity, icon: PlaneLanding },
    { label: "Budget", value: formatLabel(formData.budget), icon: WalletCards },
    { label: "Pace", value: formatLabel(formData.travelStyle), icon: Sparkles },
    { label: "Interests", value: interests || "Custom route", icon: BadgeCheck },
    { label: "Regions", value: regions.slice(0, 3).join(", ") || "Georgia", icon: MapPin },
  ].filter((item) => cleanText(item.value));

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {snapshot.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="rounded-2xl border border-black/10 bg-white/35 p-4 backdrop-blur"
          >
            <Icon className="h-5 w-5 text-amber-200" aria-hidden="true" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-amber-800">
              {item.label}
            </p>
            <p className="mt-1 text-sm font-semibold leading-5 text-stone-950">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
}

function ResultSuccessHeader({
  title,
  overview,
  formData,
  regions,
  actions,
  headingRef,
}: {
  title: string;
  overview: string;
  formData: TripFormData;
  regions: string[];
  actions: ActionHandlers;
  headingRef: RefObject<HTMLHeadingElement>;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-yellow-200 bg-[#F5B700] text-stone-950 shadow-xl shadow-yellow-900/10">
      <div className="p-5 md:p-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/25 px-3 py-1 text-sm font-semibold text-stone-950">
              <CheckCircle2 className="h-4 w-4 text-amber-800" aria-hidden="true" />
              Generated successfully
            </div>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-normal outline-none sm:text-5xl"
            >
              Your custom Georgia itinerary is ready
            </h2>
            <p className="mt-3 text-sm leading-6 text-amber-50 sm:text-base">
              Review your generated route, adjust the plan with local help,
              or send it to TripMate Georgia to organize it as a private tour.
            </p>
            {title ? <p className="mt-4 text-lg font-semibold text-stone-950">{title}</p> : null}
            {overview ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-950/85">
                {overview}
              </p>
            ) : null}
          </div>

          <ResultActionBar {...actions} />
        </div>

        <div className="mt-6">
          <TripSnapshotCards formData={formData} regions={regions} />
        </div>
      </div>
    </section>
  );
}

function ResultSectionNav() {
  const links = [
    { href: "#result-overview", label: "Overview" },
    { href: "#daily-plan", label: "Daily Plan" },
    { href: "#travel-tips", label: "Travel Tips" },
    { href: "#food", label: "Food" },
    { href: "#booking", label: "Booking" },
  ];

  return (
    <nav
      aria-label="Generated itinerary sections"
      className="sticky top-[var(--header-height)] z-20 overflow-x-auto rounded-2xl border bg-white/90 p-2 shadow-sm backdrop-blur"
    >
      <div className="flex gap-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-primary-soft hover:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function OverviewCard({
  title,
  overview,
  regions,
  days,
}: {
  title: string;
  overview: string;
  regions: string[];
  days: ItineraryDay[];
}) {
  const routeSummary = days
    .map((day) => cleanText(day.region))
    .filter(Boolean)
    .filter((region, index, array) => array.indexOf(region) === index)
    .join(" -> ");

  return (
    <section id="result-overview" className="scroll-mt-28 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm md:p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Overview</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight">
        {title || "Your Georgia route"}
      </h3>
      {overview ? (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          {overview}
        </p>
      ) : null}
      {routeSummary ? (
        <div className="mt-4 rounded-2xl border bg-muted/60 p-4 text-sm leading-6">
          <span className="font-semibold text-foreground">Generated route: </span>
          <span className="text-muted-foreground">{routeSummary}</span>
        </div>
      ) : null}
      {regions.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {regions.map((region) => (
            <span
              key={region}
              className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-foreground ring-1 ring-primary/25"
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {region}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function DetailBlock({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  if (!cleanText(value)) return null;

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="h-4 w-4 text-amber-700" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}

function GeneratedDayCard({ day }: { day: ItineraryDay }) {
  const title = cleanText(day.title);
  const region = cleanText(day.region);

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
            Day {day.day}
          </p>
          {title ? <h4 className="mt-1 text-xl font-semibold tracking-tight">{title}</h4> : null}
        </div>
        {region ? (
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
            {region}
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <DetailBlock label="Morning" value={day.morning} icon={CalendarDays} />
        <DetailBlock label="Afternoon" value={day.afternoon} icon={Sparkles} />
        <DetailBlock label="Evening" value={day.evening} icon={MapPin} />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {cleanText(day.foodSuggestion) ? (
          <div className="rounded-2xl border bg-amber-50/70 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-stone-950">
              <Utensils className="h-4 w-4 text-amber-700" aria-hidden="true" />
              Food suggestion
            </div>
            <p className="mt-2 text-sm leading-6 text-stone-950/75">
              {day.foodSuggestion}
            </p>
          </div>
        ) : null}
        {cleanText(day.travelTip) ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-stone-950">
              <Lightbulb className="h-4 w-4 text-amber-700" aria-hidden="true" />
              Travel tip
            </div>
            <p className="mt-2 text-sm leading-6 text-stone-950/75">{day.travelTip}</p>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function DayPlanSection({ days }: { days: ItineraryDay[] }) {
  return (
    <section id="daily-plan" className="scroll-mt-28 space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Daily plan
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">
          Your day-by-day Georgia route
        </h3>
      </div>
      {days.length > 0 ? (
        <div className="space-y-4">
          {days.map((day) => (
            <GeneratedDayCard key={`${day.day}-${day.title}`} day={day} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white p-5 text-sm leading-6 text-muted-foreground">
          Your trip was generated, but no day-by-day plan was returned. Create
          another trip or request local help and we will organize the route.
        </div>
      )}
    </section>
  );
}

function SummaryList({
  title,
  items,
  id,
}: {
  title: string;
  items?: string[];
  id?: string;
}) {
  const visibleItems = cleanList(items);
  if (visibleItems.length === 0) return null;

  return (
    <section id={id} className={id ? "scroll-mt-28" : undefined}>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="mt-2 space-y-2">
        {visibleItems.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ResultSummarySidebar({ result }: { result: ItineraryResultType }) {
  const estimatedBudget = cleanText(result.estimatedBudget);
  const totalPrice = cleanText(result.totalPrice);
  const pricePerPerson = cleanText(result.pricePerPerson);

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Quick summary
        </p>
        {estimatedBudget ? (
          <div className="mt-4 rounded-2xl bg-primary-soft p-4 ring-1 ring-primary/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              Estimated budget
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {estimatedBudget}
            </p>
          </div>
        ) : null}
        <div className="mt-4 space-y-4">
          {totalPrice ? (
            <div>
              <p className="text-sm font-semibold text-foreground">Total price</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{totalPrice}</p>
            </div>
          ) : null}
          {pricePerPerson ? (
            <div>
              <p className="text-sm font-semibold text-foreground">Price per person</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{pricePerPerson}</p>
            </div>
          ) : null}
          <SummaryList title="Best for" items={result.bestFor} />
          <SummaryList title="Included services" items={result.includedServices} />
          <SummaryList title="Not included" items={result.notIncludedServices} />
          <SummaryList title="Packing tips" items={result.packingTips} />
          <SummaryList title="Transport tips" items={result.transportTips} id="travel-tips" />
          <SummaryList title="Local food to try" items={result.localFoodToTry} id="food" />
        </div>
      </div>
    </aside>
  );
}

function BookingNextStepCard({
  bookingSuggestion,
  actions,
}: {
  bookingSuggestion: string;
  actions: ActionHandlers;
}) {
  return (
    <section
      id="booking"
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-yellow-200 bg-[#F5B700] text-stone-950 shadow-xl shadow-yellow-900/10"
    >
      <div className="p-5 md:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-800">
              Booking support
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              Next step: turn this plan into a real private trip
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-950">
              TripMate Georgia can help with transport, pickup, timing, route
              details, family needs, and local recommendations.
            </p>
            {bookingSuggestion ? (
              <div className="mt-4 rounded-2xl border border-black/10 bg-white/30 p-4 text-sm leading-6 text-stone-950">
                {bookingSuggestion}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="inverse"
              onClick={actions.onWhatsApp}
              className="h-11 rounded-full px-5"
            >
              <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
              WhatsApp booking request
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={actions.onEmail}
              className="h-11 rounded-full border-black/20 bg-white/25 px-5 text-stone-950 hover:bg-white/40 hover:text-stone-950"
            >
              <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
              Email request
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={actions.onDownload}
              className="h-11 rounded-full border-black/20 bg-white/25 px-5 text-stone-950 hover:bg-white/40 hover:text-stone-950"
            >
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Download / Print PDF
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ItineraryResult({
  result,
  formData,
  onReset,
}: ItineraryResultProps) {
  const resultRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const days = useMemo(() => result.days ?? [], [result.days]);
  const title = cleanText(result.tripTitle);
  const overview = cleanText(result.overview);
  const bookingSuggestion = cleanText(result.bookingSuggestion);
  const mapRegions = useMemo(() => getUniqueRegions(days), [days]);
  const whatsappBookingUrl = useMemo(() => buildWhatsAppUrl(formData), [formData]);

  useEffect(() => {
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    const focusTimer = window.setTimeout(() => headingRef.current?.focus(), 350);

    return () => window.clearTimeout(focusTimer);
  }, []);

  const handleBookingHelp = () => {
    trackEvent("booking_whatsapp_click", {
      trip_title: result.tripTitle,
      days: formData.days,
      travelers: formData.travelers,
      budget: formData.budget,
      travel_style: formData.travelStyle,
    });
    window.open(whatsappBookingUrl, "_blank", "noopener,noreferrer");
  };

  const handleEmailBookingHelp = () => {
    trackEvent("booking_email_click", {
      trip_title: result.tripTitle,
    });
    window.location.href = emailBookingUrl;
  };

  const handleDownloadPdf = () => {
    trackEvent("itinerary_pdf_download_click", {
      trip_title: result.tripTitle,
      days: days.length,
    });
    printItinerary(result);
  };

  const actions = {
    onWhatsApp: handleBookingHelp,
    onEmail: handleEmailBookingHelp,
    onDownload: handleDownloadPdf,
    onReset,
  };

  return (
    <section ref={resultRef} className="scroll-mt-24 space-y-5" aria-live="polite">
      <ResultSuccessHeader
        title={title}
        overview={overview}
        formData={formData}
        regions={mapRegions}
        actions={actions}
        headingRef={headingRef}
      />
      <ResultSectionNav />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="space-y-5">
          <OverviewCard title={title} overview={overview} regions={mapRegions} days={days} />
          <DayPlanSection days={days} />
        </div>

        <ResultSummarySidebar result={result} />
      </div>

      <BookingNextStepCard bookingSuggestion={bookingSuggestion} actions={actions} />

      <div className="flex justify-center">
        <Button type="button" variant="ghost" onClick={onReset} className="rounded-full">
          <RefreshCcw className="mr-2 h-4 w-4" aria-hidden="true" />
          Create another trip
        </Button>
      </div>
    </section>
  );
}
