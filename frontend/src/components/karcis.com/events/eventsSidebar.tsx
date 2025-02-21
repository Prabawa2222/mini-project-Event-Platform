import { useState } from "react";
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
import { IoIosMenu } from "react-icons/io"; // Import icon menu

interface FilterSidebarProps {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  selectedLocations: string[];
  onLocationChange: (location: string) => void;
  priceRange: number[];
  onPriceRangeChange: (range: number[]) => void;
}

export function FilterSidebar({
  selectedCategories,
  onCategoryChange,
  selectedLocations,
  onLocationChange,
  priceRange,
  onPriceRangeChange,
  online,
  onOnlineChange,
}: FilterSidebarProps & {
  online: boolean;
  onOnlineChange: (online: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false); // State untuk mobile sidebar

  return (
    <>
      {/* Button Toggle untuk Mobile */}
      <button
        className="md:hidden fixed top-5 left-5 bg-blue-600 text-white p-2 rounded-lg shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <IoIosMenu size={24} />
      </button>

      {/* Sidebar Wrapper */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={() => setIsOpen(false)}
      ></div>

      <Sidebar
        className={`fixed md:relative top-0 left-0 h-full md:h-auto w-64 bg-white text-black p-4 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:mt-40 md:ml-40 z-50`}
      >
        {/* Close Button untuk Mobile */}
        <button
          className="md:hidden absolute top-3 right-3 text-gray-600"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

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
              {[
                "MUSIC",
                "GENERAL",
                "SPORTS",
                "TECHNOLOGY",
                "BUSINESS",
                "EDUCATION",
                "ENTERTAINMENT",
              ].map((cat) => (
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
    </>
  );
}
