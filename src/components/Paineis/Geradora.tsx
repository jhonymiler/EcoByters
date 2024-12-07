// pages/ComprarSelo.tsx
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useApproveMoney, useGetBalance, usePurchaseSeal, useSealPurchasedLogs } from '@/contracts/managment';
import { toast } from 'react-toastify';

export default function Geradora() {
  const { data: session } = useSession();
  const userAddress = session?.user.address;
  const { balance, isLoading: balanceLoading } = useGetBalance(userAddress);
  interface SealData {
    generator: `0x${string}`;
    sealId: bigint;
    level: number;
    transactionHash: `0x${string}` | null;
    blockNumber: bigint | null;
  }

  const [data, setData] = useState<SealData[]>([]);

  const [sealLevel, setSealLevel] = useState<number>(0); // 0 - Bronze, 1 - Prata, 2 - Ouro
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { isPending: isPendingPurchase, isConfirmed: isConfirmPurchase, submit: submitPurchase } = usePurchaseSeal(
    sealLevel,
    1
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      // Verificar se a permissão é suficiente
      if (Number(balance) >= 100) {
        // Aprovar os tokens
        await submitPurchase();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao enviar a transação.');
    }
  };
  

  useEffect(() => {
    if (isConfirmPurchase) {
      toast.success('Selo comprado com sucesso!');
    }

    const fetchData = async () => {
      try {
        const result = await useSealPurchasedLogs(); // Certifique-se que essa função retorna os dados corretamente
        console.log('Data:', result);
        setData(result);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [isConfirmPurchase]);

  return (
    <Card>
      <Card.Body>
        <Card.Title>Comprar Selo Verde</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="sealLevel">
            <Form.Label>Nível do Selo</Form.Label>
            <Form.Select
              onChange={(e) => setSealLevel(Number(e.target.value))}
              required
            >
              <option value={0}>Bronze</option>
              <option value={1}>Prata</option>
              <option value={2}>Ouro</option>
            </Form.Select>
          </Form.Group>

          {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}

          <Button
            className="mt-3"
            variant="primary"
            type="submit"
            disabled={isPendingPurchase || balanceLoading }
          >
            Trocar Selo
          </Button>

          {isConfirmPurchase && <Alert variant="success" className="mt-3">Selo comprado com sucesso!</Alert>}
        </Form>
      </Card.Body>
      <Card.Body>
        <Card.Title>Seus Selos</Card.Title>
        {data.map((seal, index) => (
          <div key={index}>
            <p>Generator: {seal.generator}</p>
            <p>Seal ID: {seal.sealId.toString()}</p>
            <p>Level: {seal.level}</p>
            <p>Transaction Hash: {seal.transactionHash}</p>
            <p>Block Number: {seal.blockNumber?.toString()}</p>
          </div>
        ))}
      </Card.Body>
     
    </Card>
  );
}
