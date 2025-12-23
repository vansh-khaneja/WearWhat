/**
 * API utility functions for backend communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpResponse {
  user_id: string;
  message: string;
}

export interface LoginResponse {
  user_id: string;
  username?: string;
  email?: string;
  message: string;
}

/**
 * Sign up a new user
 */
export async function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Sign up failed' }));
    throw new Error(error.detail || 'Sign up failed');
  }

  return response.json();
}

/**
 * Login a user
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Login failed' }));
    throw new Error(error.detail || 'Invalid email or password');
  }

  return response.json();
}

export interface UploadOutfitResponse {
  outfit_id: string;
  result: boolean;
  message: string;
}

export interface Outfit {
  outfit_id: string;
  wardrobe_id: string;
  image_url: string;
  tags: Record<string, any>;
}

export interface GetOutfitsResponse {
  outfits: Outfit[];
}

/**
 * Upload an outfit image
 */
export async function uploadOutfit(file: File, wardrobeId: string): Promise<UploadOutfitResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('wardrobe_id', wardrobeId);

  const response = await fetch(`${API_BASE_URL}/outfit/upload-outfit`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(error.detail || 'Failed to upload outfit');
  }

  return response.json();
}

/**
 * Get all outfits for a wardrobe
 */
export async function getOutfits(wardrobeId: string): Promise<GetOutfitsResponse> {
  const response = await fetch(`${API_BASE_URL}/outfit/get-outfits?wardrobe_id=${wardrobeId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to fetch outfits' }));
    throw new Error(error.detail || 'Failed to fetch outfits');
  }

  return response.json();
}

export interface DeleteOutfitResponse {
  result: boolean;
  message: string;
}

/**
 * Delete an outfit
 */
export async function deleteOutfit(outfitId: string): Promise<DeleteOutfitResponse> {
  const response = await fetch(`${API_BASE_URL}/outfit/delete-outfit?outfit_id=${outfitId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to delete outfit' }));
    throw new Error(error.detail || 'Failed to delete outfit');
  }

  return response.json();
}

export interface UpdateOutfitResponse {
  result: boolean;
  message: string;
}

/**
 * Update an outfit's tags
 */
export async function updateOutfit(outfitId: string, tags: Record<string, any>): Promise<UpdateOutfitResponse> {
  const response = await fetch(`${API_BASE_URL}/outfit/update-outfit`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      outfit_id: outfitId,
      tags: tags
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to update outfit' }));
    throw new Error(error.detail || 'Failed to update outfit');
  }

  return response.json();
}
export interface SuggestOutfitRequest {
  wardrobe_id: string;
  temperature?: number;
  query?: string;
}

export interface SuggestOutfitResponse {
  outfits: Outfit[];
  composite_image_url?: string;
  result: boolean;
  message: string;
}

/**
 * Get suggested outfits
 */
export async function suggestOutfits(wardrobeId: string, temperature?: number, query?: string): Promise<SuggestOutfitResponse> {
  const response = await fetch(`${API_BASE_URL}/outfit/suggest-outfit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      wardrobe_id: wardrobeId,
      temperature: temperature,
      query: query
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to get suggestions' }));
    throw new Error(error.detail || 'Failed to get suggestions');
  }

  return response.json();
}

export interface WeeklyOutfitDay {
  day: string;
  outfit: Outfit;
  composite_image_url?: string;
}

export interface PlanWeekResponse {
  weekly_outfits: WeeklyOutfitDay[];
  result: boolean;
  message: string;
}

/**
 * Generate weekly outfit plan
 */
export async function planWeek(wardrobeId: string, temperature?: number): Promise<PlanWeekResponse> {
  const response = await fetch(`${API_BASE_URL}/outfit/plan-week`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      wardrobe_id: wardrobeId,
      temperature: temperature
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to plan week' }));
    throw new Error(error.detail || 'Failed to plan week');
  }

  return response.json();
}

