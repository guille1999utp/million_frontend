import { Owner } from '../owner';
import { PropertyImage } from '../propertyImage';
import { PropertyTrace } from '../propertyTrace';

export interface Property {
  id: string;
  name: string;
  address: string;
  price: number;
  codeInternal: string;
  year: number;
  idOwner: string;
  owner: Owner;
  images: PropertyImage[];
  traces: PropertyTrace[];
}
