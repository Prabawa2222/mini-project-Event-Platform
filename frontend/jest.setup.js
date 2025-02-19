require("@testing-library/jest-dom");

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));
