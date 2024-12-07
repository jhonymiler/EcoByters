import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ConnectWallet from '../ConnectWallet';
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import Link from 'next/link'; // Importando o componente Link do Next.js
import Image from 'next/image';

import { useContext } from 'react';
import { ColorSchemeContext } from '@/contexts/ColorSchemeProvider';
import { useSession } from 'next-auth/react';

export default function Menu() {
    const theme = useContext(ColorSchemeContext);
    const { data: session } = useSession();

    return (
        <>
            <Head>
                <title>Empresa Verde</title>
                <meta name="description" content="Sistema de certificação ambiental" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar bg={theme} data-bs-theme={theme}>
                <Container>
                    <Navbar.Brand href="#home">
                        <Image src={`/ecobyters_${theme}.svg`}
                            alt="Logo"
                            width={75}
                            height={75} />
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} href="/">Home</Nav.Link> {/* Link otimizado */}
                        <Nav.Link as={Link} href="/authorizeds">Empresas autorizadas</Nav.Link>
                        <Nav.Link as={Link} href="/certifieds">Empresas verdes</Nav.Link>
                        <Nav.Link as={Link} href="/register">
                            {session?.user?.email ? "Meus Dados" : "Me Registrar"}
                        </Nav.Link>
                    </Nav>
                    <ConnectWallet />
                </Container>
            </Navbar>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    );
}
