export interface ItineraryDay {
  day: string;
  title: string;
  description: string;
}

export interface Package {
  id: string;
  title: string;
  image: string;
  price: string;
  basePrice: number;
  duration: string;
  description: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  terms: string[];
}

const standardTerms = [
  "50% advance payment required for booking confirmation.",
  "Remaining 50% must be cleared 7 days prior to departure.",
  "Cancellations made 15 days prior to departure are eligible for a 50% refund.",
  "No refunds for cancellations within 15 days of departure.",
  "The itinerary is subject to change based on weather and road conditions.",
  "Personal expenses, tips, and insurances are not included."
];

export const packages: Package[] = [
  {
    id: "kedarnath",
    title: "Kedarnath",
    image: "/images/kedarnath.jpg",
    price: "₹18,500",
    basePrice: 18500,
    duration: "6 Days / 5 Nights",
    description: "Experience the ultimate spiritual journey to the divine abode of Lord Shiva. Nestled in the snow-clad peaks of the Himalayas, Kedarnath offers not just a pilgrimage, but a transformative journey of the soul. Our curated package ensures a comfortable trek, priority darshan, and serene accommodations amidst the mountains.",
    highlights: ["VIP Darshan at Kedarnath Temple", "Guided trek from Gaurikund", "Comfortable stay with majestic mountain views", "All meals included (pure vegetarian)"],
    itinerary: [
      { day: "Day 1", title: "Arrival in Haridwar/Rishikesh", description: "Arrive at Haridwar or Rishikesh. Meet our representative and drive to Guptkashi. Evening free for acclimatization and visiting the local Kashi Vishwanath temple. Overnight stay in Guptkashi." },
      { day: "Day 2", title: "Guptkashi to Kedarnath", description: "Early morning drive to Gaurikund. Begin the 16km trek to Kedarnath (by foot, pony, or palanquin). Arrive at Kedarnath base camp by evening. Overnight stay in a tent/guest house." },
      { day: "Day 3", title: "Kedarnath Darshan & Return", description: "Wake up before dawn for the Mangal Darshan at the Kedarnath Temple. After soaking in the divine energy, trek back down to Gaurikund and drive to Guptkashi for the night." },
      { day: "Day 4", title: "Guptkashi to Chopta (Optional)", description: "Rest day in Guptkashi or take a short excursion to the pristine meadows of Chopta (Mini Switzerland of India)." },
      { day: "Day 5", title: "Return to Rishikesh", description: "Drive back towards Rishikesh along the winding mountain roads. Enjoy the evening Ganga Aarti at Triveni Ghat." },
      { day: "Day 6", title: "Departure", description: "Morning breakfast and drop-off at the railway station or airport for your onward journey." }
    ],
    inclusions: ["Transportation by AC vehicle", "Accommodation on twin sharing basis", "Breakfast and Dinner (Pure Veg)", "Trekking Guide from Gaurikund", "Medical First Aid kit"],
    exclusions: ["Helicopter tickets (can be added in calculator)", "Pony/Palanquin charges", "Lunch during the trek", "Personal expenses and tips"],
    terms: standardTerms
  },
  {
    id: "jaisalmer",
    title: "Jaisalmer",
    image: "/images/jasilmar.jpg",
    price: "₹15,000",
    basePrice: 15000,
    duration: "5 Days / 4 Nights",
    description: "Step into the Golden City of India. Jaisalmer brings the magic of the Thar desert to life with its magnificent forts, sprawling sand dunes, and vibrant Rajasthani culture. Sleep under the stars in a luxury desert camp and witness sunsets that turn the world to gold.",
    highlights: ["Luxury Desert Camp stay in Sam Sand Dunes", "Camel Safari at sunset", "Guided tour of Jaisalmer Fort & Havelis", "Traditional Rajasthani folk dance & music evening"],
    itinerary: [
      { day: "Day 1", title: "Arrival in Jodhpur & Drive to Jaisalmer", description: "Arrive in Jodhpur and drive through the desert landscape to Jaisalmer. Check into your heritage hotel and relax." },
      { day: "Day 2", title: "Golden Fort & Havelis", description: "Explore the living Jaisalmer Fort, Patwon Ki Haveli, and Salim Singh Ki Haveli. Evening visit to Gadisar Lake." },
      { day: "Day 3", title: "Desert Safari Experience", description: "Drive to the Sam Sand Dunes. Enjoy a thrilling jeep safari followed by a peaceful camel ride at sunset. Spend the night in a luxury Swiss tent." },
      { day: "Day 4", title: "Cultural Night & Stargazing", description: "Wake up in the desert. Enjoy local village tours and an evening of Kalbelia dance performances and bonfire." },
      { day: "Day 5", title: "Departure", description: "After breakfast, transfer to Jaisalmer or Jodhpur airport/station for departure." }
    ],
    inclusions: ["AC vehicle for transfers and sightseeing", "Heritage hotel and Luxury Tent accommodation", "Daily Breakfast and Dinner", "Camel Safari", "Cultural program entry"],
    exclusions: ["Monument entry fees", "Jeep safari (can be added)", "Lunches", "Camera fees"],
    terms: standardTerms
  },
  {
    id: "badrinath",
    title: "Badrinath",
    image: "/images/badrinath.jpg",
    price: "₹16,500",
    basePrice: 16500,
    duration: "6 Days / 5 Nights",
    description: "Journey to the sacred shrine of Lord Vishnu, situated between the Nar and Narayana mountain ranges. Badrinath is a realm of profound peace and awe-inspiring natural beauty. Cleanse your spirit in the Tapt Kund before experiencing the divine grace of the temple.",
    highlights: ["Darshan at Badrinath Temple", "Visit to Mana Village (Last Indian Village)", "Holy dip in Tapt Kund", "Scenic drive through the Garhwal Himalayas"],
    itinerary: [
      { day: "Day 1", title: "Haridwar to Joshimath", description: "Drive from Haridwar along the Alaknanda river. Pass through Devprayag and Rudraprayag. Overnight stay in Joshimath." },
      { day: "Day 2", title: "Joshimath to Badrinath", description: "Drive to Badrinath. Check into the hotel. Evening visit to the Badrinath temple for Aarti." },
      { day: "Day 3", title: "Badrinath Darshan & Mana Village", description: "Early morning bath in Tapt Kund followed by Darshan. Later, visit Mana village, Vyas Gufa, and Bhim Pul." },
      { day: "Day 4", title: "Badrinath to Rudraprayag", description: "After breakfast, begin the descent back towards the plains. Stop at Nandprayag and Karnaprayag. Overnight in Rudraprayag." },
      { day: "Day 5", title: "Rudraprayag to Rishikesh", description: "Drive down to Rishikesh. Check into the ashram/hotel. Evening free for Ganga Aarti at Parmarth Niketan." },
      { day: "Day 6", title: "Departure", description: "Morning yoga session (optional). Transfer to Dehradun airport or Haridwar railway station." }
    ],
    inclusions: ["Transportation by AC vehicle", "Accommodation on twin sharing basis", "Breakfast and Dinner", "All toll tax, parking, and driver allowance"],
    exclusions: ["VIP Darshan tickets", "Lunch", "Personal expenses", "Helicopter transfers"],
    terms: standardTerms
  },
  {
    id: "rishikesh",
    title: "Rishikesh",
    image: "/images/download5.jpg",
    price: "₹12,000",
    basePrice: 12000,
    duration: "4 Days / 3 Nights",
    description: "Find your center in the Yoga Capital of the World. Where the holy Ganges flows from the Himalayas, Rishikesh offers a perfect blend of spiritual awakening and thrilling adventure. Meditate by the riverbanks, witness the mesmerizing Ganga Aarti, and conquer the river rapids.",
    highlights: ["VIP seating for evening Ganga Aarti at Parmarth Niketan", "White Water River Rafting", "Guided Yoga and Meditation session", "Visit to Beatles Ashram"],
    itinerary: [
      { day: "Day 1", title: "Arrival & Ashram Visit", description: "Arrive in Rishikesh. Check into your riverside camp or hotel. Visit the Beatles Ashram and Ram Jhula." },
      { day: "Day 2", title: "River Rafting & Ganga Aarti", description: "Morning 16km thrilling white water rafting from Shivpuri. Evening VIP seating for the spectacular Ganga Aarti at Triveni Ghat." },
      { day: "Day 3", title: "Yoga & Waterfall Trek", description: "Early morning guided Yoga session overlooking the Ganges. Afternoon trek to Neer Garh Waterfall for a refreshing dip." },
      { day: "Day 4", title: "Departure", description: "After a hearty breakfast, bid farewell to the spiritual town and transfer to the airport/station." }
    ],
    inclusions: ["Accommodation in Riverside Tents/Hotel", "All meals (Breakfast, Lunch, Dinner)", "16km River Rafting", "One Yoga Session", "Local Guide"],
    exclusions: ["Bungee Jumping (can be added)", "Transportation to Rishikesh", "Personal expenses"],
    terms: standardTerms
  },
  {
    id: "shimla",
    title: "Shimla",
    image: "/images/shimla.jpg",
    price: "₹14,500",
    basePrice: 14500,
    duration: "5 Days / 4 Nights",
    description: "Escape to the Queen of Hills. Shimla's colonial charm, misty pine forests, and cool mountain breeze make it the perfect rejuvenating getaway. Walk down the historic Mall Road, ride the heritage toy train, and soak in the panoramic views of the Himalayas.",
    highlights: ["Heritage Toy Train ride from Kalka", "Guided walk down Mall Road & The Ridge", "Visit to Jakhu Temple", "Excursion to Kufri for snow activities"],
    itinerary: [
      { day: "Day 1", title: "Toy Train & Arrival", description: "Board the heritage Toy Train from Kalka to Shimla. Enjoy breathtaking views of the pine-covered valleys. Transfer to hotel." },
      { day: "Day 2", title: "Shimla Local Sightseeing", description: "Visit the Viceregal Lodge, The Ridge, Christ Church, and take a hike up to Jakhu Temple to see the giant Hanuman statue." },
      { day: "Day 3", title: "Excursion to Kufri", description: "Full day excursion to Kufri. Enjoy horseback riding, yak rides, and snow activities (seasonal) in the high-altitude Himalayan nature park." },
      { day: "Day 4", title: "Mashobra & Naldehra", description: "Visit the peaceful pine forests of Mashobra and the famous 9-hole golf course at Naldehra. Evening free for shopping on Mall Road." },
      { day: "Day 5", title: "Departure", description: "After breakfast, check out from the hotel and drive back to Kalka/Chandigarh for your onward journey." }
    ],
    inclusions: ["AC vehicle for transfers", "Kalka-Shimla Toy Train tickets (Standard)", "3 Star Hotel Accommodation", "Breakfast and Dinner"],
    exclusions: ["Lunch", "Entry tickets for activities in Kufri", "Pony/Horse ride charges"],
    terms: standardTerms
  },
  {
    id: "vrindavan",
    title: "Vrindavan",
    image: "/images/vrindavan.jpg",
    price: "₹10,500",
    basePrice: 10500,
    duration: "3 Days / 2 Nights",
    description: "Immerse yourself in the divine love of Lord Krishna. Vrindavan, with its thousands of temples, vibrant streets, and the continuous chanting of 'Radhe Radhe', offers a spiritual experience unlike any other. Witness the magical Ganga Aarti in Mathura and explore the places where Krishna spent his childhood.",
    highlights: ["Darshan at Banke Bihari Temple", "Visit to Prem Mandir and ISKCON", "Boat ride on the Yamuna river at sunset", "Exploration of Gokul and Mathura"],
    itinerary: [
      { day: "Day 1", title: "Arrival in Mathura & Vrindavan", description: "Arrive in Mathura, the birthplace of Lord Krishna. Visit Shri Krishna Janmabhoomi. Drive to Vrindavan and check into your hotel. Evening visit to Prem Mandir to witness the spectacular light show." },
      { day: "Day 2", title: "Vrindavan Temple Tour", description: "Early morning Darshan at Banke Bihari Temple. Visit ISKCON temple, Radha Raman Temple, and Nidhivan. Evening boat ride on the Yamuna river." },
      { day: "Day 3", title: "Gokul Visit & Departure", description: "Morning drive to Gokul to see Raman Reti and Chaurasi Khamba. After lunch, transfer to the railway station or airport for your onward journey." }
    ],
    inclusions: ["AC vehicle for transfers and sightseeing", "Comfortable Hotel Accommodation", "Daily Breakfast and Dinner", "Local Guide in Vrindavan"],
    exclusions: ["Lunch", "Camera fees at temples", "Boat ride charges (optional)", "Personal donations"],
    terms: standardTerms
  },
  {
    id: "nainital",
    title: "Nainital",
    image: "/images/nanital.jpg",
    price: "₹13,000",
    basePrice: 13000,
    duration: "4 Days / 3 Nights",
    description: "Escape to the enchanting Lake District of India. Surrounded by emerald peaks, Nainital offers a perfect blend of serene nature and vibrant hill-station life. Sail across the Naini Lake, explore the exotic flora at the high-altitude zoo, and witness panoramic Himalayan views from Snow View Point.",
    highlights: ["Boating in the famous Naini Lake", "Cable car ride to Snow View Point", "Visit to Naina Devi Temple", "Excursion to Bhimtal and Sattal lakes"],
    itinerary: [
      { day: "Day 1", title: "Arrival in Nainital", description: "Arrive in Kathgodam and drive up the winding roads to Nainital. Check into your hotel. Evening walk along the Mall Road and visit the Naina Devi Temple." },
      { day: "Day 2", title: "Lake Tour & Sightseeing", description: "Enjoy a morning boat ride on Naini Lake. Take the aerial ropeway to Snow View Point for stunning views of Nanda Devi. Visit the High Altitude Zoo." },
      { day: "Day 3", title: "Excursion to Lake District", description: "Full day excursion to explore the surrounding lakes: Bhimtal, Sattal, and Naukuchiatal. Enjoy nature walks and bird watching." },
      { day: "Day 4", title: "Departure", description: "After a hearty breakfast overlooking the lake, drive back to Kathgodam/Delhi for your onward journey." }
    ],
    inclusions: ["AC vehicle for transfers", "3 Star Hotel Accommodation with lake view options", "Daily Breakfast and Dinner", "One Boat Ride ticket on Naini Lake"],
    exclusions: ["Lunch", "Cable car tickets", "Entry tickets for Zoo", "Personal expenses"],
    terms: standardTerms
  }
];
