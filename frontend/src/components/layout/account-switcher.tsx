'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Building } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAccountStore } from '@/store/account-store'

export function AccountSwitcher() {
  const [open, setOpen] = React.useState(false)
  
  const { accounts, activeAccountId, setActiveAccount, getActiveAccount } = useAccountStore()
  const activeAccount = getActiveAccount()

  const triggerBtn = React.useMemo(() => (
    <button
      role="combobox"
      aria-expanded={open}
      className={cn(buttonVariants({ variant: "outline" }), "w-[250px] justify-between border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:text-white transition-all text-neutral-200")}
    />
  ), [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={triggerBtn}>
          <div className="flex items-center gap-2 truncate">
            <Building className="h-4 w-4 text-blue-400" />
            <span className="truncate">
              {activeAccount ? activeAccount.name : "Select account..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 border-neutral-800 bg-neutral-900/95 backdrop-blur-xl">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search account..." className="text-sm h-9 border-none focus:ring-0" />
          <CommandList>
            <CommandEmpty>No account found.</CommandEmpty>
            <CommandGroup heading="Accounts" className="text-neutral-400">
              {accounts.map((account) => (
                <CommandItem
                  key={account.id}
                  value={account.name}
                  onSelect={() => {
                    setActiveAccount(account.id)
                    setOpen(false)
                    // We might need to refresh data or trigger a reload here
                    // window.location.reload()
                  }}
                  className="data-[selected=true]:bg-neutral-800 data-[selected=true]:text-white text-neutral-300 flex items-center justify-between"
                >
                  <div className="flex flex-col gap-0.5">
                    <span>{account.name}</span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">{account.role}</span>
                  </div>
                  <Check
                    className={cn(
                      "h-4 w-4 text-blue-500",
                      activeAccountId === account.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
