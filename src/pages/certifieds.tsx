// src/pages/index.tsx
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { Container } from "react-bootstrap";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import ListBusiness from "@/components/ListBusiness";

export default function Certifieds(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // ou uma tela de carregamento
    }

    return (
        <>
            <Container className="mt-5">
                <h1>Empresas Certificadas</h1>
                <ListBusiness companyType='geradora' />
            </Container>
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
