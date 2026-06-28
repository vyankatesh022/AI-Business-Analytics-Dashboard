import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Account {
  id: string;
  name: string;
  slug: string;
  role: string;
}

interface AccountState {
  accounts: Account[];
  activeAccountId: string | null;
  setAccounts: (accounts: Account[]) => void;
  setActiveAccount: (id: string) => void;
  getActiveAccount: () => Account | undefined;
  clear: () => void;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      accounts: [
        { id: 'tenant-1', name: 'Acme Corp', slug: 'acme-corp', role: 'admin' }
      ],
      activeAccountId: 'tenant-1',
      setAccounts: (accounts) => {
        set({ accounts });
        const currentActive = get().activeAccountId;
        if (!currentActive && accounts.length > 0) {
          set({ activeAccountId: accounts[0].id });
        }
      },
      setActiveAccount: (id) => set({ activeAccountId: id }),
      getActiveAccount: () => {
        const { accounts, activeAccountId } = get();
        return accounts.find((a) => a.id === activeAccountId);
      },
      clear: () => set({ accounts: [], activeAccountId: null }),
    }),
    {
      name: 'account-storage',
    }
  )
);
