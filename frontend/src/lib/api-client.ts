import { useAccountStore } from '@/store/account-store';
import { createClient } from './supabase/client';

export class ApiClient {
  static getBaseUrl() {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  static async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers = new Headers(options.headers || {});
    
    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`);
    }

    const activeAccount = useAccountStore.getState().getActiveAccount();
    if (activeAccount) {
      headers.set('X-Account-ID', activeAccount.id);
    }

    const response = await fetch(`${this.getBaseUrl()}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}
