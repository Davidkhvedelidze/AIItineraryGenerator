export type TourImportData = {
  title: string
  slug: string | {_type: 'slug'; current: string}
  [key: string]: unknown
}

function block(text: string) {
  return {
    _type: 'block',
    style: 'normal',
    children: [
      {
        _type: 'span',
        text,
      },
    ],
  }
}

export const toursData: TourImportData[] = [
  {
    _id: 'tour-canyons-tour-in-imereti-region',
    _type: 'tour',
    title: 'Canyons Tour in Imereti Region',
    slug: {_type: 'slug', current: 'canyons-tour-in-imereti-region'},
    excerpt:
      'A private full-day Georgia tour from Tbilisi to Martvili Canyon, Okatse Canyon, and Kinchkha Waterfall with a private driver, hotel pickup, and flexible comfort for families and groups.',
    gallery: [],
    duration: '12 hours',
    startingLocation: 'Tbilisi',
    endingLocation: 'Tbilisi',
    tourType: 'Nature and adventure day tour',
    groupType: 'Private',
    customizable: true,
    priceFrom: 0,
    pricingTiers: [
      {
        label: 'Adult, 2-3 travelers',
        price: 139,
        currency: 'USD',
        note: 'Suggested retail price per adult for private groups of 2-3 travelers.',
      },
      {
        label: 'Adult, 4-7 travelers',
        price: 109,
        currency: 'USD',
        note: 'Suggested retail price per adult for private groups of 4-7 travelers.',
      },
      {
        label: 'Adult, 8-15 travelers',
        price: 84,
        currency: 'USD',
        note: 'Suggested retail price per adult for private groups of 8-15 travelers.',
      },
      {
        label: 'Infant, 0-5',
        price: 0,
        currency: 'USD',
        note: 'Infants must sit on laps unless an infant seat is requested.',
      },
      {
        label: 'Child, 0-5',
        price: 49,
        currency: 'USD',
        note: 'Suggested retail child price from the product pricing schedule.',
      },
      {
        label: 'Youth, 0-5',
        price: 77,
        currency: 'USD',
        note: 'Suggested retail youth price from the product pricing schedule.',
      },
    ],
    currency: 'USD',
    priceNote:
      'Adult pricing varies by private group size. Entrance fees for Martvili Canyon, Okatse Canyon, and Kinchkha Waterfall are paid separately.',
    directBookingEnabled: true,
    cancellationPolicy: 'Contact us before booking for the current cancellation terms.',
    bookingCutoff: 'Pickup starts 10 minutes before departure.',
    confirmationMethod: 'Booking request confirmation by phone or message.',
    maxTravelers: 15,
    ageGroups: [
      {
        label: 'Infant',
        range: '0-5',
        note: 'Infants must sit on laps. Infant seats are available on request.',
      },
      {
        label: 'Child',
        range: '0-5',
        note: 'Child pricing is available in the product pricing schedule.',
      },
      {
        label: 'Youth',
        range: '0-5',
        note: 'Youth pricing is available in the product pricing schedule.',
      },
      {
        label: 'Adult',
        range: '2-15 travelers',
        note: 'Adult private group pricing depends on total group size.',
      },
    ],
    requiredTravelerInfo: ['Pickup hotel or address in Tbilisi', 'Traveler count', 'Contact phone number'],
    operatingDays: ['Saturday', 'Sunday'],
    operatorCancellationRights:
      'The operator may adjust timing or route details if road, weather, canyon access, or safety conditions require changes.',
    bookingNotificationNote:
      'Please share your Tbilisi hotel or apartment address when booking so the driver can confirm pickup details.',
    guideLanguage: 'English',
    guideNote: 'The in-person English-speaking guide is also the private driver.',
    audioGuide: 'None',
    writtenGuide: 'None',
    difficultyLevel: 'Most travelers can participate',
    contactPhone: 'GE +995 551 18 13 58',
    listingName: 'Must See Georgia',
    listingLocation: 'Tbilisi, Tbilisi',
    directBookingCtaTitle: 'Book a Private Canyons Tour from Tbilisi',
    directBookingCtaText:
      'Reserve a private driver for your family or group and visit Imereti canyons at a comfortable pace with hotel pickup, air-conditioned transport, bottled water, and onboard WiFi.',
    tripadvisorCtaTitle: 'Check This Tour on TripAdvisor',
    tripadvisorCtaText:
      'Compare the listing details and request the private Imereti canyons experience for your preferred Saturday or Sunday departure.',
    pickupInfo:
      'We pick up all travelers from any hotel or custom pickup location in Tbilisi. Pickup starts 10 minutes before the 7:00 AM departure.',
    pickupLocations: ['Any hotel in Tbilisi', 'Custom pickup location in Tbilisi'],
    departureTimes: ['7:00 AM'],
    bestFor: [
      'Gulf and GCC families seeking a private driver in Georgia',
      'Private groups who want nature, canyons, and waterfalls in one long day',
      'Travelers staying in Tbilisi who want a full-day Georgia tour from Tbilisi',
      'Visitors who prefer air-conditioned private transport over shared buses',
    ],
    regions: ['Tbilisi', 'Imereti', 'Samegrelo-Zemo Svaneti'],
    badges: ['Private tour', 'Hotel pickup', 'Family friendly', 'Nature', 'Adventure'],
    overview: [
      block(
        'Start this private Georgia tour from Tbilisi with hotel pickup and a comfortable drive west toward the Imereti region. The route is designed for travelers who want a private driver in Georgia, flexible pacing, and a nature-focused day away from the city.',
      ),
      block(
        'The tour combines Martvili Canyon, Okatse Canyon, and Kinchkha Waterfall in one long but rewarding day. It is a strong choice for Gulf and GCC family travelers who value privacy, air-conditioned transport, bottled water, WiFi on board, and the ability to keep the day comfortable for children and mixed-age groups.',
      ),
      block(
        'Your English-speaking driver-guide handles the road logistics while you focus on the scenery: canyon walks, waterfall views, and the changing landscapes between Tbilisi, Kutaisi, and western Georgia.',
      ),
    ],
    highlights: [
      'Private 12-hour canyons tour from Tbilisi with hotel pickup',
      'Visit Martvili Canyon, Okatse Canyon, and Kinchkha Waterfall in one day',
      'Travel by private air-conditioned car or minivan with WiFi on board',
      'English-speaking driver-guide for a more personal Georgia tour from Tbilisi',
      'Good fit for families, GCC travelers, and private groups who prefer flexible pacing',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Tbilisi to Kutaisi and the Imereti Canyons',
        region: 'Imereti',
        description:
          'Depart from Tbilisi at 7:00 AM and travel west by private car or minivan. Pass through Kutaisi without stopping, then visit Martvili Canyon, Okatse Canyon, and Kinchkha Waterfall before returning to Tbilisi.',
        stops: [
          'Kutaisi, pass by without stopping',
          'Martvili Canyon, 1 hour',
          'Okatse Canyon, 1 hour 30 minutes',
          'Kinchkha Waterfall, 45 minutes',
        ],
        mealsIncluded: false,
        accommodationIncluded: false,
      },
    ],
    included: ['Bottled water', 'Air-conditioned vehicle', 'Private transportation', 'WiFi on board'],
    notIncluded: [
      'Food and drink',
      'Entrance to Martvili Canyon, approximately USD 6 per adult',
      'Entrance to Okatse Canyon, approximately USD 7 per adult',
      'Entrance to Kinchkha Waterfall, approximately USD 7 per person',
      'Optional 4x4 car in Okatse Canyon',
    ],
    importantNotes: [
      'Tour starts from Tbilisi.',
      'The tour operates on Saturday and Sunday with a 7:00 AM departure.',
      'Three separate entrance fees apply and may be displayed in the traveler price breakdown.',
      'Road time is significant because this is a full-day private tour from Tbilisi to western Georgia.',
    ],
    accessibilityNotes: [
      'Not wheelchair accessible',
      'Near public transportation',
      'Infants must sit on laps',
      'Infant seats available',
    ],
    healthNotes: [
      'Not recommended for travelers with back problems',
      'Not recommended for travelers with heart problems or other serious medical conditions',
    ],
    faq: [
      {
        question: 'Does this canyons tour start from Tbilisi?',
        answer:
          'Yes. The tour starts from Tbilisi with pickup from any hotel or custom pickup location in the city.',
      },
      {
        question: 'Is this a private tour?',
        answer:
          'Yes. This is a private tour by car or minivan with private transportation and an English-speaking driver-guide.',
      },
      {
        question: 'Are canyon entrance fees included?',
        answer:
          'No. Entrance fees for Martvili Canyon, Okatse Canyon, and Kinchkha Waterfall are paid separately.',
      },
      {
        question: 'Is this tour suitable for families from the Gulf or GCC?',
        answer:
          'Yes. The private format, hotel pickup, air-conditioned vehicle, and flexible pacing make it a good fit for families who prefer comfort and privacy.',
      },
    ],
    reviews: [],
    metaTitle: 'Private Imereti Canyons Tour from Tbilisi | Martvili & Okatse',
    metaDescription:
      'Book a private Georgia tour from Tbilisi to Martvili Canyon, Okatse Canyon and Kinchkha Waterfall with a private driver in Georgia, hotel pickup, WiFi and family-friendly transport.',
  },
]
