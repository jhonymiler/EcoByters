// src/components/ConnectWallet/index.tsx

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSignMessage, useAccount } from "wagmi";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function ConnectWallet() {
    const { data: session } = useSession();
    const { signMessageAsync } = useSignMessage();
    const { isConnected, address, isDisconnected } = useAccount();


    useEffect(() => {
        const handleLogin = async () => {
            if (!isConnected || session?.user.address == address) return;

            try {
                await signIn("credentials", {
                    address,
                    redirect: false,
                });
            } catch (error) {
                console.error("Erro na assinatura:", error);
            }
        };

        handleLogin(); // Trigger authentication when the user connects the wallet
    }, [isConnected, signMessageAsync, session, address]);

    useEffect(() => {
        const logout = async () => {
            if (isDisconnected && session) {
                await signOut();
            }
        }
        logout();
    }, [isConnected, session, isDisconnected]);

    return (
        <div>
            <ConnectButton chainStatus="icon" label="Conectar Carteira" />
        </div>
    );
}
