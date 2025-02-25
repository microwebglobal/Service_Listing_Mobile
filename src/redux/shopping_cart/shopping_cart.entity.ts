export interface BookingPayment {
  payment_id: string;
  booking_id: string;
  subtotal: string;
  tip_amount: string;
  tax_amount: string;
  discount_amount: string;
  total_amount: string;
  payment_method: string;
  payment_status: string;
}

export interface ServiceItem {
  item_id: string;
  service_id: string;
  name: string;
  description: string;
  overview: string;
  base_price: string;
  icon_url: string;
  CitySpecificPricings: Array<any>;
}

export interface BookingItem {
  id: number;
  booking_id: string;
  item_id: string;
  item_type: string;
  quantity: number;
  unit_price: string;
  special_price: number;
  total_price: number;
  serviceItem: ServiceItem;
  packageItem: any;
}

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

export interface CartState {
  shoppingCart: Booking | null;
}
