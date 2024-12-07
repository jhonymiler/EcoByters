import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, Form, Button } from "react-bootstrap";
import { useGetBalance, useRecordTransaction } from "@/contracts/managment";
import { toast } from "react-toastify";
import { parseUnits } from "viem";

interface Business {
  hash: string;
  name: string;
  companyName: string;
}

interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

export default function Recicladora() {
  const { data: session } = useSession();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [tonnes, setTonnes] = useState("0");
  const [invoiceKey, setInvoiceKey] = useState("");
  const { balance } = useGetBalance(session?.user.address);
  const tokenAddress = process.env.NEXT_PUBLIC_CONTRACT_TOKEN!;
  const icon = process.env.NEXT_PUBLIC_TOKEN_ICON!;
  const symbol = "TON"; // Ajuste conforme necessário
  const decimals = 18;

  // Hook para interação com o contrato
  const { isPending, isConfirming, isConfirmed, submit } = useRecordTransaction(
    selectedBusiness as `0x${string}`,
    Number(parseUnits(tonnes.toString(), 18)),
    invoiceKey
  );

  const handleSubmit = async (e: HandleSubmitEvent): Promise<void> => {
    e.preventDefault();
    await submit();
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch("/api/list-business?companyType=geradora");
        const data = await response.json();
        setBusinesses(data);
      } catch (error) {
        console.error("Erro ao buscar empresas:", error);
      }
    };

    fetchBusinesses();
  }, []);

  const addTokenToWallet = async () => {
    if (
      typeof window !== "undefined" &&
      window.ethereum &&
      Number(balance) > 0 &&
      !localStorage.getItem("tokenAdded")
    ) {
      try {
        const wasAdded = await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
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
          localStorage.setItem("tokenAdded", "true");
        } else {
          console.log(`Você rejeitou a adição de ${symbol} à sua carteira.`);
        }
      } catch (error) {
        console.error(`Erro ao adicionar o token: ${error}`);
      }
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Transação registrada com sucesso!");
      addTokenToWallet();
    }
  }, [isConfirmed]);

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Registrar Transação</Card.Title>
          <Card.Text>Recicladora: {session?.user?.name}</Card.Text>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="empresa">
              <Form.Label>Selecione a Empresa Geradora</Form.Label>
              <Form.Select
                value={selectedBusiness}
                onChange={(e) => setSelectedBusiness(e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                {businesses.map((biz) => (
                  <option key={biz.hash} value={biz.hash}>
                    {biz.companyName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="tonnes" className="mt-3">
              <Form.Label>Toneladas</Form.Label>
              <Form.Control
                type="number"
                value={tonnes}
                onChange={(e) => setTonnes(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="invoiceKey" className="mt-3">
              <Form.Label>Chave da Fatura</Form.Label>
              <Form.Control
                type="text"
                value={invoiceKey}
                onChange={(e) => setInvoiceKey(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              className="mt-3"
              variant="primary"
              type="submit"
              disabled={isPending || isConfirming}
            >
              {isPending
                ? "Enviando..."
                : isConfirming
                  ? "Confirmando..."
                  : "Registrar"}
            </Button>
            {isConfirmed && (
              <div className="mt-3 text-success">Transação confirmada!</div>
            )}
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
