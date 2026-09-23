export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type SubmissionStatus = "pending" | "approved" | "rejected";
export type ReportStatus = "pending" | "resolved" | "dismissed";
export type ReportReason =
  | "wrong_phone"
  | "incorrect_hours"
  | "business_closed"
  | "wrong_address"
  | "other";

export interface Locality {
  id: string;
  name: string;
  slug: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Business {
  id: string;
  localityId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  showExactAddress: boolean;
  logoUrl: string | null;
  coverImageUrl: string | null;
  isHomeBusiness: boolean;
  providesDelivery: boolean;
  providesHomeService: boolean;
  accessibility: boolean;
  kosher: boolean;
  verified: boolean;
  active: boolean;
  featured: boolean;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryLink {
  businessId: string;
  categoryId: string;
  subcategoryId: string | null;
}

export interface BusinessHour {
  id: string;
  businessId: string;
  dayOfWeek: DayOfWeek;
  openTime: string;
  closeTime: string;
}

export interface BusinessImage {
  id: string;
  businessId: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
}

export interface Recommendation {
  id: string;
  businessId: string;
  residentKey: string;
  createdAt: string;
}

export interface BusinessSubmission {
  id: string;
  businessName: string;
  categoryId: string;
  subcategoryId: string | null;
  description: string;
  phone: string;
  whatsapp: string | null;
  contactPerson: string;
  imageUrl: string | null;
  status: SubmissionStatus;
  reviewerNote: string | null;
  createdBusinessId: string | null;
  createdAt: string;
}

export interface BusinessClaim {
  id: string;
  businessId: string;
  claimantName: string;
  phone: string;
  email: string;
  message: string;
  claimantUserId: string | null;
  status: SubmissionStatus;
  reviewerNote: string | null;
  createdAt: string;
}

export interface BusinessReport {
  id: string;
  businessId: string;
  reason: ReportReason;
  details: string | null;
  contact: string | null;
  status: ReportStatus;
  createdAt: string;
}

export interface BusinessOwner {
  id: string;
  businessId: string;
  userId: string;
  role: "owner";
  createdAt: string;
}

export interface CatalogStore {
  version: number;
  localities: Locality[];
  categories: Category[];
  subcategories: Subcategory[];
  tags: Tag[];
  businesses: Business[];
  categoryLinks: CategoryLink[];
  businessTags: { businessId: string; tagId: string }[];
  hours: BusinessHour[];
  images: BusinessImage[];
  recommendations: Recommendation[];
  submissions: BusinessSubmission[];
  claims: BusinessClaim[];
  reports: BusinessReport[];
  owners: BusinessOwner[];
}

export interface CategoryPlacement {
  category: Category;
  subcategory: Subcategory | null;
}

export interface OpenState {
  open: boolean;
  label: string;
  detail: string | null;
}

export interface BusinessView extends Business {
  locality: Locality;
  categories: CategoryPlacement[];
  tags: Tag[];
  hours: BusinessHour[];
  images: BusinessImage[];
  recommendationCount: number;
  openNow: boolean;
  openState: OpenState;
  openFriday: boolean;
}

export interface SearchFilters {
  q: string;
  category?: string;
  subcategory?: string;
  openNow: boolean;
  delivery: boolean;
  homeService: boolean;
  homeBusiness: boolean;
  accessibility: boolean;
  openFriday: boolean;
}

export interface ActionState {
  error?: string;
  success?: boolean;
  message?: string;
}

/**
 * Future "צריך משהו?" request. Not implemented.
 * A resident would describe a need; participating businesses could receive it.
 * No AI is involved. Kept here so the concept stays explicit in the domain model.
 */
export interface FutureLeadRequest {
  id: string;
  localityId: string;
  categoryId: string;
  subcategoryId: string | null;
  requestText: string;
  preferredTiming: string | null;
  contactName: string;
  contactPhone: string;
  status: "open" | "sent" | "closed";
  createdAt: string;
}
