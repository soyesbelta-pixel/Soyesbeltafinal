
export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export type Step = 'upload' | 'select' | 'generating' | 'result';

export interface GeneratedImages {
  front: string | null;
  side: string | null;
}
