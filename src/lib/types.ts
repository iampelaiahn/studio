
import { products } from "./data";

export type ProductWithImage = Omit<(typeof products)[0], 'price'> & {
    imageUrl?: string;
    imageHint?: string;
};

declare global {
  interface Window {
    showSaveFilePicker: any;
  }
}
