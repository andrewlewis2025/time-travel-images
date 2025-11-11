
export interface UploadedImage {
  dataUrl: string;
  mimeType: string;
  width: number;
  height: number;
}

export interface GeneratedImage {
  decade: string;
  imageUrl: string | null;
  status: 'success' | 'error';
  error?: string;
}

export interface ProgressState {
  isLoading: boolean;
  completed: number;
  total: number;
  label: string;
}
