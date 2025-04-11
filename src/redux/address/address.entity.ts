export interface AddressEntity {
  id: number;
  userId: number;
  type: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  is_primary: boolean;
  longitude: string;
  latitude: string;
}

export interface AddressState {
  addresses: Array<AddressEntity | null>;
  cityId: string | null;
  address: string | null;
}
