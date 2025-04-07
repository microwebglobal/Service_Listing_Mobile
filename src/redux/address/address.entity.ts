export interface AddressEntity {
  type: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  is_primary: boolean;
}

export interface AddressState {
  addresses: Array<AddressEntity | null>;
  address: string | null;
}
