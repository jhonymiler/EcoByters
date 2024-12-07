import {  usePublicClient, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import GreenSealPlatform from '../../build/contracts/GreenSealPlatform.json';
import GreenSealToken from '../../build/contracts/GreenSealToken.json';
import { Abi, createPublicClient, decodeEventLog, etherUnits, formatEther, http, parseAbiItem, parseUnits } from 'viem';
import { AbiEvent, Log } from 'viem';

const sealPurchasedEventAbi: AbiEvent = {
  type: 'event',
  name: 'SealPurchased',
  inputs: [
    { indexed: true, name: 'generator', type: 'address' },
    { indexed: false, name: 'sealId', type: 'uint256' },
    { indexed: false, name: 'level', type: 'uint8' },
  ],
};

const platformAddress = process.env.NEXT_PUBLIC_CONTRACT_PLATFORM as `0x${string}`;
const tokenAddress = process.env.NEXT_PUBLIC_CONTRACT_TOKEN as `0x${string}`;
const nftAddress = process.env.NEXT_PUBLIC_CONTRACT_NFT as `0x${string}`;

type ContractAddress = `0x${string}`;

const localChain = {
    id: Number(process.env.NEXT_PUBLIC_CHAIN_ID), // Conversão explícita para número
    name: 'Ganache',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: { http: [process.env.NEXT_PUBLIC_RPC_URL as string] },
    },
}; 


export const publicClient = createPublicClient({
  chain: localChain,
  transport: http()
})

export function useGetBalance(userAddress: string | undefined) {
  const { data, isError, isLoading } = useReadContract({
    address: tokenAddress,
    abi: GreenSealToken.abi,
    functionName: 'balanceOf',
    args: [userAddress],
  });

  const balance = data ? formatEther(BigInt(data.toString())) : '0';

  return { balance, isError, isLoading };
}

// Interagir com o contrato da Plataforma
export function useRecordTransaction(generator: `0x${string}`, tonnes: number, invoiceKey: string) {
  return useContract(GreenSealPlatform.abi as Abi, platformAddress, 'recordTransaction', [generator, BigInt(tonnes), invoiceKey]);
}

// Exemplo para registrar Recicladora
export function useRegisterRecycler() {
  return useContract(GreenSealPlatform.abi as Abi, platformAddress, 'registerRecycler', []);
}

// Exemplo para registrar Gerador
export function useRegisterWasteGenerator() {
  return useContract(GreenSealPlatform.abi as Abi, platformAddress, 'registerWasteGenerator', []);
}

// Exemplo para comprar um selo
// level: 0 - Bronze, 1 - Prata, 2 - Ouro
// lowerLevelTokenId: caso level seja Prata ou Ouro, precisa deste ID
export function usePurchaseSeal(level: number, lowerLevelTokenId: number | 0) {
  return useContract(GreenSealPlatform.abi as Abi, platformAddress, 'purchaseSeal', [level, lowerLevelTokenId]);
}


export async function useSealPurchasedLogs() {

  const logs: Log[] = await publicClient.getLogs({
    address: platformAddress as `0x${string}`,
    event: sealPurchasedEventAbi,
  });

  return logs.map((log) => {
    const parsed = decodeEventLog({
      abi: [sealPurchasedEventAbi],
      data: log.data,
      topics: log.topics,
    });

    // Informando ao TypeScript a estrutura de 'args'
    const args = parsed.args as {
      generator: `0x${string}`;
      sealId: bigint;
      level: number;
    };

    return {
      generator: args.generator,
      sealId: args.sealId,
      level: args.level,
      transactionHash: log.transactionHash,
      blockNumber: log.blockNumber,
    };
  });
}

// Exemplo para registrar Gerador
export function useApproveMoney() {
  console.log('useApproveMoney',parseUnits('100', 18) )
  const data = useContract(GreenSealToken.abi as Abi, platformAddress, 'approve', [
    platformAddress,
    parseUnits('100', 18) 
  ]);
  return data
}

export function useContractPlatform(method: string, args: unknown[] = []) {
  return useContract(GreenSealPlatform.abi as Abi,platformAddress, method, args)
}


function useContract(contractAbi: Abi, contract: ContractAddress, method: string, args: unknown[] = []) {
  const {
    data: hash,
    isPending,
    writeContract
  } = useWriteContract()

  const submit = async (): Promise<void> => {

    writeContract({
      address: contract,
      abi: contractAbi,
      functionName: method,
      args: args,
    })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed, error } =
    useWaitForTransactionReceipt({
      hash,
    })

    if (error) {
      console.error(error)
    }

  return {
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    submit
  };
}
