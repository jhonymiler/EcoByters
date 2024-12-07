// src/pages/buy-seal.tsx
import { Container, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useSession } from "next-auth/react";
// Ajustar importações e hooks conforme necessidade para interagir com "purchaseSeal"

export default function BuySeal() {
    const { data: session } = useSession();
    const [level, setLevel] = useState('Bronze');
    const [lowerLevelTokenId, setLowerLevelTokenId] = useState('');

    // Aqui chamar o hook useContractPlatform('purchaseSeal', [levelComoEnum, tokenId]) no submit
    // Converter string do enum no frontend conforme necessário.

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Realizar chamada no contrato
    }

    if (!session?.user) return <Container>Conecte e registre-se primeiro.</Container>;

    return (
        <Container className="mt-5">
            <h3>Comprar Selo</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Select value={level} onChange={e => setLevel(e.target.value)}>
                    <option value="Bronze">Bronze</option>
                    <option value="Prata">Prata</option>
                    <option value="Ouro">Ouro</option>
                </Form.Select>
                {(level === 'Prata' || level === 'Ouro') && (
                    <Form.Control
                        className="mt-2"
                        type="text"
                        placeholder="Token ID do selo inferior"
                        value={lowerLevelTokenId}
                        onChange={e => setLowerLevelTokenId(e.target.value)}
                        required
                    />
                )}
                <Button className="mt-3" type="submit">Comprar</Button>
            </Form>
        </Container>
    );
}
