import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Container, Row, Button } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import { useGetBalance } from '@/contracts/managment';
import ListBusiness from '@/components/ListBusiness';
import Header from '@/components/Header/index';
import Geradora from '@/components/Paineis/Geradora';
import Recicladora from '@/components/Paineis/Recicladora';
import { formatEther, parseUnits } from 'viem';
import { parseEther } from 'viem/utils';
import { getFormattedBalance } from '@/utils/formats';

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession();
  const userAddress = session?.user?.address;

  const { balance, isError, isLoading } = useGetBalance(userAddress);
  const tokenAddress = process.env.NEXT_PUBLIC_CONTRACT_TOKEN!;
    const icon = process.env.NEXT_PUBLIC_TOKEN_ICON!;
    const symbol = 'TON'; // Ajuste conforme necessário
    const decimals = 18;  
    
    useEffect(() => {
        const addTokenToWallet = async () => {
            if (
                typeof window !== "undefined" &&
                window.ethereum &&
                Number(balance) > 0 &&
                !localStorage.getItem('tokenAdded')
            ) {
                try {
                    const wasAdded = await window.ethereum.request({
                        method: 'wallet_watchAsset',
                        params: {
                            type: 'ERC20',
                            options: {
                                address: tokenAddress,
                                symbol: symbol,
                                decimals: decimals,
                                image: icon,
                            },
                        },
                    });

                    if (wasAdded) {
                        console.log(`${symbol} foi adicionado à sua carteira!`);
                        localStorage.setItem('tokenAdded', 'true');
                    } else {
                        console.log(`Você rejeitou a adição de ${symbol} à sua carteira.`);
                    }
                } catch (error) {
                    console.error(`Erro ao adicionar o token: ${error}`);
                }
            }
        };

        addTokenToWallet();
    }, [balance]);

    
  return (
    <>
          {session?.user?.isRegistered ? (
            <>
              <h2>{session.user.name}</h2>
              {isLoading ? (
                <p>Carregando balanço...</p>
              ) : isError ? (
                <p>Erro ao carregar balanço.</p>
              ) : (
                <p>Seu saldo: {getFormattedBalance(balance) || '0.00'} Tons</p>

              )}
              {session?.user?.companyType == 'geradora' && (<Geradora/>)}
              {session?.user?.companyType == 'recicladora' && (<Recicladora/>)}
            </>
          ) : (
            <>
              <Header/>
              <Container className="mt-5">
                <h2>Lista de Empresas Certificadas</h2>
                <ListBusiness companyType='geradora' />
              </Container>
            </>
          )}
        
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      session,
    },
  };
};
