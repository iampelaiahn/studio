
import { products } from "./data";

export type ProductWithImage = (typeof products)[0] & {
    imageUrl?: string;
    imageHint?: string;
};

declare global {
  interface Window {
    showSaveFilePicker: any;
  }
}
