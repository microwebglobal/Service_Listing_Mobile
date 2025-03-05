export interface ItemEntity {
  itemId: string;
  sectionId: string;
  itemType: string;
  name: string;
  price: number;
  quantity: number;
  icon_url: string;
}

export interface CartState {
  cart: Array<ItemEntity> | null;
}
