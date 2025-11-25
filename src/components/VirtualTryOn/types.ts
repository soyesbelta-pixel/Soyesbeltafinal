
export interface Product {
  id: string | number;
  name: string;
  displayName?: string; // Display name for user (Spanish)
  image: string;
  imageSrc?: string; // For backwards compatibility
  localImagePath?: string; // Path to local product image
  prompt: string;
}

export interface GeneratedResult {
    image: string | null;
    text: string | null;
}
