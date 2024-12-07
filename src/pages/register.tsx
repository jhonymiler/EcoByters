// src/pages/index.tsx
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import Register from "@/components/Register";
import { Container, Row } from "react-bootstrap";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { useGetBalance } from "@/contracts/managment";
import { getFormattedBalance } from "@/utils/formats";

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const { data: session } = useSession();
    const userAddress = session?.user?.address;
    const { balance, isError, isLoading } = useGetBalance(userAddress);

    return (
        <>

            {session ? (
                <>
                    <h2>{session.user.name}</h2>
                    {isLoading ? (
                        <p>Carregando balanço...</p>
                    ) : isError ? (
                        <p>Erro ao carregar balanço.</p>
                    ) : (
                        <p>Seu saldo: {getFormattedBalance(balance) || '0.00'} Tons</p>
                    )}
                    <h1>Cadastro de empresa</h1>
                    <Register />
                </>
            ) : (
                <>
                    <h1>Empresa Verde</h1>
                    <p>Conecte sua Carteira</p>
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
