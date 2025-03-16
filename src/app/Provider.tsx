'use client'

import { AuthenticationStatus, connectorsForWallets, createAuthenticationAdapter, RainbowKitAuthenticationProvider, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react'
import { createClient, http } from 'viem';
import { soneiumMinato } from 'viem/chains';
import { createConfig, WagmiProvider } from 'wagmi';


type ProviderProps = {
    children: React.ReactNode
}


const connectors = connectorsForWallets(
    [
        {
            groupName: 'Popular',
            wallets: [
                // 推奨するウォレットを指定する
                metaMaskWallet,
            ],
        },
    ],
    {
        appName: 'Test App',
        projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID as string,
    }
);

export const wagmiConfig = createConfig({
    chains: [soneiumMinato],
    ssr: true,
    connectors,
    client({ chain }) {
        return createClient({ chain, transport: http() })
    },
})

const queryClient = new QueryClient()


export default function Provider({ children }: ProviderProps) {

    const [authStatus, setAuthStatus] = useState<AuthenticationStatus>('unauthenticated')


    const authenticationAdapter = createAuthenticationAdapter({
        getNonce: async () => {
            return "Todo: nonce"
        },
        createMessage: ({ nonce, address, chainId }) => {
            return `Sign this message to authenticate with ${chainId} on ${address}: ${nonce}`
        },
        verify: async () => {
            setAuthStatus('authenticated')
            return true
        },
        signOut: async () => {
            alert('signOut')
            setAuthStatus('unauthenticated')
        },
    })

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitAuthenticationProvider adapter={authenticationAdapter} status={authStatus}>
                    <RainbowKitProvider locale={"ja-JP"}>
                        {children}
                    </RainbowKitProvider>
                </RainbowKitAuthenticationProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
