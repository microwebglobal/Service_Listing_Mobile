import {PackageItem} from '../../components/RenderPackage';
import {ServiceItem} from '../category/ServiceTypeScreen';

export interface Booking {
  booking_id: string;
  user_id: number;
  provider_id: string;
  city_id: string;
  booking_date: string;
  status: string;
  service_address: string;
  customer_notes: string;
  BookingItems: Array<BookingItem>;
  BookingPayment: BookingPayment;
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
}
