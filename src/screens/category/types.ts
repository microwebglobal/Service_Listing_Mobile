export interface Category {
  category_id: string;
  name: string;
  slug: string;
  icon_url: string;
  display_order: number;
}

export interface SubCategory {
  sub_category_id: string;
  category_id: string;
  name: string;
  slug: string;
  icon_url: string;
  display_order: number;
  ServiceTypes: Array<ServiceType>;
}

export interface ServiceType {
  type_id: string;
  sub_category_id: string;
  name: string;
  icon_url: string;
  description: string;
  display_order: number;
  Services: Array<Service>;
}

export interface Service {
  service_id: string;
  type_id: string;
  name: string;
  description: string;
  display_order: number;
  icon_url: string;
}

export interface ServiceItem {
  item_id: string;
  service_id: string;
  name: string;
  description: string;
  duration_hours: number;
  duration_minutes: number;
  overview: string;
  base_price: string;
  advance_percentage: string;
  is_home_visit: boolean;
  icon_url: string;
  CitySpecificPricings: Array<CitySpecificPricing>;
}

export interface CitySpecificPricing {
  id: number;
  city_id: string;
  item_id: string;
  item_type: string;
  price: string;
}

export interface Package {
  package_id: string;
  type_id: string;
  name: string;
  description: string;
  duration_hours: number;
  duration_minutes: number;
  grace_period: string;
  penalty_percentage: string;
  advance_percentage: string;
  display_order: number;
  icon_url: string;
  ServiceType: {
    name: string;
    description: string;
  };
  PackageSections: Array<PackageSections>;
  default_price: number;
}

export interface PackageSections {
  section_id: string;
  package_id: string;
  name: string;
  description: string;
  display_order: number;
  icon_url: string;
  PackageItems: Array<PackageItem>;
}

export interface PackageItem {
  item_id: string;
  section_id: string;
  name: string;
  description: string;
  price: string;
  is_default: boolean;
  is_none_option: boolean;
  display_order: number;
  icon_url: string;
  CitySpecificPricings: Array<CitySpecificPricing>;
}
