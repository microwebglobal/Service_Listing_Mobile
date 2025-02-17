export interface ItemEntity {
  itemId: string;
  itemType: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartState {
  cart: Array<ItemEntity> | null;
}
