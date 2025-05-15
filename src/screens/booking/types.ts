import {PackageItem, ServiceItem} from '../category/types';

export interface Booking {
  booking_id: string;
  user_id: number;
  provider_id: string;
  employee_id: number;
  city_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  service_address: string;
  customer_notes: string;
  BookingItems: Array<BookingItem>;
  BookingPayment: BookingPayment;
  provider: Provider;
}

export interface BookingItem {
  id: number;
  booking_id: string;
  item_id: string;
  item_type: string;
  quantity: number;
  unit_price: string;
  special_price: string;
  total_price: string;
  advance_payment: string;
  serviceItem: Array<ServiceItem>[];
  packageItem: Array<PackageItem>[];
}

export interface BookingPayment {
  payment_id: string;
  booking_id: string;
  subtotal: string;
  tip_amount: string;
  tax_amount: string;
  discount_amount: string;
  total_amount: string;
  advance_payment: string;
  payment_method: string;
  payment_status: string;
  transaction_id: string;
  refund_id: string;
  refund_amount: string;
  service_commition: string;
  refund_status: string;
  cash_collected_at: string;
  cash_collected_by: string;
  updated_at: string;
}

export interface User {
  u_id: number;
  name: string;
  email: string;
  mobile: string;
  photo: null;
  pw: string;
  role: string;
  account_status: string;
  email_verified: boolean;
  mobile_verified: boolean;
  gender: string;
  nic: string;
  dob: string;
}

interface ServiceCategory {
  category_id: string;
  name: string;
  slug: string;
  icon_url: string;
  display_order: number;
  employee_service_categories: {
    employee_id: 1;
    category_id: string;
  };
}

export interface Employee {
  employee_id: number;
  provider_id: number;
  user_id: number;
  role: string;
  qualification: string;
  years_experience: number;
  status: string;
  User: User;
  ServiceCategories: Array<ServiceCategory>;
}

export interface Provider {
  provider_id: number;
  user_id: number;
  enquiry_id: null;
  business_type: string;
  business_name: string;
  business_registration_number: string;
  aadhar_number: string;
  pan_number: string;
  whatsapp_number: string;
  emergency_contact_name: string;
  reference_name: string;
  reference_number: string;
  primary_location: {
    type: string;
    coordinates: Array<number>;
  };
  service_radius: number;
  availability_type: string;
  availability_hours: {
    Monday: string;
    Tuesday: string;
  };
  years_experience: number;
  specializations: Array<string>;
  qualification: string;
  profile_bio: string;
  languages_spoken: Array<string>;
  social_media_links: {
    facebook: string;
    linkedin: string;
  };
  rejection_reason: null;
  rejection_date: null;
  payment_method: string;
  payment_details: {
    account_number: string;
    bank_name: string;
  };
  User: {
    name: string;
    email: string;
    mobile: string;
    photo: string;
  };
}
