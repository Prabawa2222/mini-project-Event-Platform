import Card from "@/components/karcis.com/UI/cardEvent";

interface ListEventsPageProps {
  selectedCategories: string[];
  selectedLocations: string[];
  priceRange: number[];
}

const events = [
  {
    id: 1,
    imageSrc: "/exmp_evnt.png",
    title: "Event 1",
    date: "2025-02-10",
    location: "Jakarta Selatan",
    price: "Rp. 500.000",
    category: "Concert",
    isOnline: true,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut metus eget lorem tempus viverra. Nulla facilisi. Integer non ex eget justo tincidunt interdum. Suspendisse potenti.",
  },
  {
    id: 2,
    imageSrc: "/topsell2.png",
    title: "Event 2",
    date: "2025-02-15",
    location: "Bandung",
    price: "Rp. 300.000",
    category: "Arts",
    isOnline: false,
    description:
      "Curabitur nec metus id risus eleifend fermentum. Donec pharetra nunc id suscipit auctor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
  },
  {
    id: 3,
    imageSrc: "/topsell1.png",
    title: "Event 3",
    date: "2025-02-20",
    location: "Tangerang Selatan",
    price: "Rp. 200.000",
    category: "Conference",
    isOnline: true,
    description:
      "Aliquam erat volutpat. Mauris ut felis quis magna aliquet tincidunt. Nam sed libero velit. Etiam vulputate arcu ut urna scelerisque, nec tincidunt libero scelerisque.",
  },
  {
    id: 4,
    imageSrc: "/exmp_evnt.png",
    title: "Event 4",
    date: "2025-02-25",
    location: "Jabodetabek",
    price: "Rp. 450.000",
    category: "Movies",
    isOnline: false,
    description:
      "Pellentesque ac erat sed eros aliquet rhoncus. Duis eu ex vel neque fringilla euismod. In hac habitasse platea dictumst. Integer fermentum felis in metus feugiat, in gravida odio bibendum.",
  },
];

export default function ListEventsPage({
  selectedCategories,
  selectedLocations,
  priceRange,
  online,
  searchQuery,
  startDate, // Tambahkan startDate sebagai props
  endDate, // Tambahkan endDate sebagai props
}: ListEventsPageProps & {
  online: boolean;
  searchQuery: string;
  startDate: Date | null;
  endDate: Date | null;
}) {
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date); // Mengonversi tanggal event ke objek Date
    const eventPrice = parseInt(
      event.price.replace("Rp. ", "").replace(/\./g, ""),
      10
    );

    // Apply search query filter
    const matchesSearchQuery =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter berdasarkan tanggal
    const isInDateRange =
      (!startDate || eventDate.getTime() >= startDate.getTime()) &&
      (!endDate || eventDate.getTime() <= endDate.getTime());

    return (
      (selectedCategories.length === 0 ||
        selectedCategories.includes(event.category)) &&
      (selectedLocations.length === 0 ||
        selectedLocations.includes(event.location)) &&
      eventPrice >= priceRange[0] &&
      eventPrice <= priceRange[1] &&
      (online ? event.isOnline : true) && // Filter berdasarkan status online
      matchesSearchQuery && // Apply search filter
      isInDateRange // Apply date range filter
    );
  });

  return (
    <div className="flex-1 p-6 mt-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">List Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} {...event} isOnline={event.isOnline} />
        ))}
      </div>
    </div>
  );
}
