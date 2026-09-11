export type PreviewDevice = "desktop" | "mobile";

export type PlacementDim = "location" | "timing" | "type";

export interface CreateAdState {
  adType: string;
  startDate: string; // ISO YYYY-MM-DD
  endDate: string; // ISO YYYY-MM-DD
  locations: string[];
  timings: string[];
  types: string[];
  directories: string[];
  title: string;
  description: string;
  clientLink: string;
  videoLink: string;
  featuredProgram: string;
  programs: string[];
  customizeClientLink: boolean;
  previewDevice: PreviewDevice;
  uploadedFileName: string | null;
  uploadedPreviewUrl: string | null;
  profileBannerDismissed: boolean;
}

export interface NavItem {
  key: string;
  label: string;
}

export type CheckoutStep = "closed" | "cart" | "billing" | "done";

export interface PlacementSnapshot {
  adType: string;
  locations: string[];
  timings: string[];
  types: string[];
  startDate: string;
  endDate: string;
}

export interface CartItem extends PlacementSnapshot {
  id: string;
  price: number;
}
