import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

export const Wagmiconfig = createConfig({
  chains: [base],
  connectors: [coinbaseWallet()],
  transports: {
    [base.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof Wagmiconfig
  }
}