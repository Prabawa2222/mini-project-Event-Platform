"use client";

import NavbarEvents from "@/components/karcis.com/events/navbar.events.component";
import { FilterSidebar } from "@/components/karcis.com/events/eventsSidebar";
import { SidebarProvider } from "@/components/karcis.com/UI/sidebarEvents";
import Footer from "@/components/karcis.com/common/Footer";
import ListEventsPage from "@/components/karcis.com/events/listEvent.events.component";
import { useState } from "react";

export default function Events() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [online, setOnline] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location]
    );
  };

  const handleOnlineChange = (value: boolean) => {
    setOnline(value);
  };

  const handleSearch = (
    query: string,
    start: Date | null,
    end: Date | null
  ) => {
    setSearchQuery(query);
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <NavbarEvents onSearch={handleSearch} />
        <div className="flex flex-1 gap-4 p-6">
          <FilterSidebar
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            selectedLocations={selectedLocations}
            onLocationChange={handleLocationChange}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            online={online}
            onOnlineChange={handleOnlineChange}
          />
          <div className="flex-grow">
            <ListEventsPage
              selectedCategories={selectedCategories}
              selectedLocations={selectedLocations}
              priceRange={priceRange}
              online={online}
              searchQuery={searchQuery}
              startDate={startDate} // Pass the selected startDate
              endDate={endDate} // Pass the selected endDate
            />
          </div>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
