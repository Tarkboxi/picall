import { Photo } from "./Photo.model";

export interface PhotoDisplayer {
  photos: Photo[];
  total: number;
  count: number;
  page: number;
}
