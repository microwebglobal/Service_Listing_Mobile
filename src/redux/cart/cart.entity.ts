export interface ItemEntity {
  itemId: string;
  sectionId: string;
  itemType: string;
  name: string;
  price: number;
  quantity: number;
  icon_url: string;
  is_home_visit: boolean;
  packageName: string | null;
}

export interface CartState {
  cart: Array<ItemEntity> | null;
}
