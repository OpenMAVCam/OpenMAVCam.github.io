export interface SpecificationRow { label: string; value: string }
export interface SpecificationGroup { title: string; rows: SpecificationRow[] }
export interface Product {
  slug: string;
  name: string;
  summary: string;
  heroImage: {src: string; alt: string};
  specificationGroups: SpecificationGroup[];
}
