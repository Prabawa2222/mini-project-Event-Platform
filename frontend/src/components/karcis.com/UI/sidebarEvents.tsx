import { ReactNode, createContext, useContext, useState } from "react";

// Sidebar Context
const SidebarContext = createContext({
  isOpen: false,
  toggle: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarEvents() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarEvents must be used within a SidebarProvider");
  }
  return context;
}

// Sidebar.tsx
export function Sidebar({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <aside className={`w-64 bg-white text-black p-4 shadow-md ${className}`}>
      {children}
    </aside>
  );
}

// SidebarHeader.tsx
export function SidebarHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
}

// SidebarContent.tsx
export function SidebarContent({ children }: { children: ReactNode }) {
  return <div className="mt-4 space-y-4">{children}</div>;
}

// SidebarGroup.tsx
export function SidebarGroup({ children }: { children: ReactNode }) {
  return <div className="border-b border-gray-300 pb-3">{children}</div>;
}

// SidebarGroupLabel.tsx
export function SidebarGroupLabel({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-medium text-gray-700 mb-2">{children}</h3>;
}

// SidebarGroupContent.tsx
export function SidebarGroupContent({ children }: { children: ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

// Switch.tsx
export function Switch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <button
      className={`w-10 h-5 flex items-center rounded-full p-1 transition duration-300 ${
        checked ? "bg-blue-500" : "bg-gray-300"
      }`}
      onClick={() => onCheckedChange(!checked)}
    >
      <div
        className={`bg-black w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      ></div>
    </button>
  );
}

// Checkbox.tsx
export function Checkbox({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="w-4 h-4 text-blue-500 bg-white border-gray-400 rounded focus:ring-blue-400"
    />
  );
}

// Slider.tsx

interface SliderProps {
  value: number[];
  onValueChange: (val: number[]) => void;
  min: number;
  max: number;
  step: number;
  className?: string; // Menambahkan className untuk styling
}

export function Slider({ value, onValueChange, min, max, step }: SliderProps) {
  const progressStart = ((value[0] - min) / (max - min)) * 100;
  const progressEnd = ((value[1] - min) / (max - min)) * 100;

  return (
    <div className="relative w-full pb-1">
      {/* Slider untuk nilai kiri */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={(e) => {
          const newValue = parseInt(e.target.value);
          if (newValue <= value[1]) {
            onValueChange([newValue, value[1]]);
          }
        }}
        className="absolute w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none"
        style={{
          background: `linear-gradient(to right, #3b82f6 ${progressStart}%, #d1d5db ${progressStart}%)`,
        }}
      />
      {/* Slider untuk nilai kanan */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[1]}
        onChange={(e) => {
          const newValue = parseInt(e.target.value);
          if (newValue >= value[0]) {
            onValueChange([value[0], newValue]);
          }
        }}
        className="absolute w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none"
        style={{
          background: `linear-gradient(to right, #3b82f6 ${progressEnd}%, #d1d5db ${progressEnd}%)`,
        }}
      />
    </div>
  );
}
