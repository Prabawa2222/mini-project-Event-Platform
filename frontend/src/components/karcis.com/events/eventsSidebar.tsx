import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  Switch,
  Checkbox,
  Slider,
} from "@/components/karcis.com/UI/sidebarEvents";
import { useState } from "react";

interface FilterSidebarProps {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  selectedLocations: string[];
  onLocationChange: (location: string) => void;
  priceRange: number[]; // Tambahkan props untuk priceRange
  onPriceRangeChange: (range: number[]) => void; // Fungsi untuk mengubah priceRange
}

export function FilterSidebar({
  selectedCategories,
  onCategoryChange,
  selectedLocations,
  onLocationChange,
  priceRange,
  onPriceRangeChange,
  online,
  onOnlineChange, // Add a new prop for online state change
}: FilterSidebarProps & {
  online: boolean;
  onOnlineChange: (online: boolean) => void;
}) {
  return (
    <Sidebar className="w-64 bg-white text-black p-4 mt-40 ml-40 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
      <SidebarHeader className="text-lg font-semibold">Filters</SidebarHeader>
      <SidebarContent>
        {/* Online Filter */}
        <SidebarGroup>
          <SidebarGroupLabel>Online</SidebarGroupLabel>
          <SidebarGroupContent>
            <Switch checked={online} onCheckedChange={onOnlineChange} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Location Filter */}
        <SidebarGroup>
          <SidebarGroupLabel>Location</SidebarGroupLabel>
          <SidebarGroupContent>
            {["Jakarta", "Bandung", "Semarang", "Yogyakarta", "Surabaya"].map(
              (loc) => (
                <div key={loc} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedLocations.includes(loc)}
                    onCheckedChange={() => onLocationChange(loc)}
                  />
                  <span
                    className={
                      selectedLocations.includes(loc) ? "text-blue-500" : ""
                    }
                  >
                    {loc}
                  </span>
                </div>
              )
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories Filter */}
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            {["Concert", "Arts", "Conference", "Movies"].map((cat) => (
              <div key={cat} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedCategories.includes(cat)}
                  onCheckedChange={() => onCategoryChange(cat)}
                />
                <span
                  className={
                    selectedCategories.includes(cat) ? "text-blue-500" : ""
                  }
                >
                  {cat}
                </span>
              </div>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Price Filter */}
        <SidebarGroup>
          <SidebarGroupLabel>Price</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-4">
              <div className="w-full mb-4">
                <Slider
                  value={priceRange}
                  onValueChange={onPriceRangeChange}
                  min={0}
                  max={10000000}
                  step={10000}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Rp. {priceRange[0].toLocaleString()}</span>
                <span>Rp. {priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
