import { IAddress } from "./address";

export interface IOrderWrite {
  basketId: string;
  deliveryMethodId: number;
  shipToAddress: IAddress;
}

export interface IOrderItem {
  productId: number;
  price: number;
  quantity: number;
  productName: string;
  pictureUrl: string;
}

export interface IOrder {
  id: number;
  buyerEmail: string;
  orderDate: Date;
  shipToAddress: IAddress;
  deliveryMethod: string;
  shippingPrice: number;
  orderItems: IOrderItem[];
  subTotal: number;
  total: number;
  status: string;
}