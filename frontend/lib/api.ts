/**
 * API utility functions for backend communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  latitude?: number;
  longitude?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  latitude?: number;
  longitude?: number;
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

async function parseJsonSafe(response: Response): Promise<any | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function handleUnauthorized() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_username');
    } catch {}
    // Redirect with reason for middleware and UI to allow re-auth
    const url = new URL(window.location.origin + '/login');
    url.searchParams.set('reason', 'session-expired');
    window.location.href = url.toString();
  }
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...init,
  });

  if (response.status === 401) {
    handleUnauthorized();
    const err = await parseJsonSafe(response);
    throw new Error((err && err.detail) || 'Unauthorized');
  }

  if (!response.ok) {
    const err = await parseJsonSafe(response);
    throw new Error((err && err.detail) || 'Request failed');
  }

  return response.json();
}

/**
 * Sign up a new user
 */
export async function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  return apiFetch<SignUpResponse>('/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

/**
 * Login a user
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

/**
 * Get current session using cookie
 */
export async function getSession(): Promise<LoginResponse | null> {
  const response = await fetch(`${API_BASE_URL}/auth/session`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

/**
 * Logout: clears auth cookie
 */
export async function logout(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/auth/logout', { method: 'POST' });
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
  // wardrobeId ignored by backend; cookie-scoped user_id is used
  return apiFetch<UploadOutfitResponse>('/outfit/upload-outfit', {
    method: 'POST',
    body: formData,
  });
}

/**
 * Get all outfits for a wardrobe
 */
export async function getOutfits(wardrobeId: string): Promise<GetOutfitsResponse> {
  // wardrobeId ignored by backend; cookie-scoped user_id is used
  return apiFetch<GetOutfitsResponse>('/outfit/get-outfits', { method: 'GET' });
}

export interface DeleteOutfitResponse {
  result: boolean;
  message: string;
}

/**
 * Delete an outfit
 */
export async function deleteOutfit(outfitId: string): Promise<DeleteOutfitResponse> {
  return apiFetch<DeleteOutfitResponse>(`/outfit/delete-outfit?outfit_id=${outfitId}`, { method: 'DELETE' });
}

export interface UpdateOutfitResponse {
  result: boolean;
  message: string;
}

/**
 * Update an outfit's tags
 */
export async function updateOutfit(outfitId: string, tags: Record<string, any>): Promise<UpdateOutfitResponse> {
  return apiFetch<UpdateOutfitResponse>('/outfit/update-outfit', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ outfit_id: outfitId, tags }),
  });
}
export interface SuggestOutfitRequest {
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
export async function suggestOutfits(temperature?: number, query?: string): Promise<SuggestOutfitResponse> {
  return apiFetch<SuggestOutfitResponse>('/outfit/suggest-outfit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ temperature, query }),
  });
}

export interface DailyPlan {
  date: string;
  day: string;
  image_url?: string;
  outfit_ids: string[];
}

export interface WeeklyPlan {
  plan_id: string;
  wardrobe_id: string;
  created_at: string;
  week_start: string;
  daily_plans: Record<string, DailyPlan>;
}

export interface CreateWeeklyPlanResponse {
  result: boolean;
  message: string;
}

export interface GetWeeklyPlanResponse {
  weekly_plans: WeeklyPlan[];
}

export interface WeeklyOutfitDay {
  day: string;
  outfit: Outfit;
  composite_image_url?: string;
  temperature?: number;
  condition?: string;
  condition_icon?: string;
}

export interface ChatRequest {
  message: string;
  temperature?: number;
  context?: Record<string, any>;
}

export interface ChatResponse {
  response: string;
  image_urls?: string[];
  result: boolean;
  message: string;
}

/**
 * Create weekly outfit plan
 */
export async function createWeeklyPlan(temperature?: number): Promise<CreateWeeklyPlanResponse> {
  return apiFetch<CreateWeeklyPlanResponse>('/weekly/create-plan', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ temperature }),
  });
}

/**
 * Get weekly plan for current user
 */
export async function getWeeklyPlan(): Promise<GetWeeklyPlanResponse> {
  return apiFetch<GetWeeklyPlanResponse>('/weekly/plan', {
    method: 'GET',
  });
}

/**
 * Chat about outfits and fashion with AI
 */
export async function outfitChat(message: string, temperature?: number, context?: Record<string, any>): Promise<ChatResponse> {
  return apiFetch<ChatResponse>('/chat/outfit-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, temperature, context }),
  });
}

