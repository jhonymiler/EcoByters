import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import ListBusiness from '@/components/ListBusiness';

type AuthorizedListProps = {
    companyType: string; // Define o tipo da propriedade esperada
};

export default function Business({ companyType }: AuthorizedListProps) {
    const [businesses, setBusinesses] = useState([]);

    useEffect(() => {
        // Função para buscar dados da API
        const fetchBusinesses = async () => {
            try {
                const response = await fetch(`/api/list-business?companyType=${companyType}`); // Substitua pelo endpoint correto
                const data = await response.json();
                setBusinesses(data);
            } catch (error) {
                console.error("Erro ao buscar empresas:", error);
            }
        };

        fetchBusinesses();
    }, [companyType]);

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Carteira</th>
                        <th>Nome Empresa</th>
                        <th>Telefone</th>
                        <th>Email</th>
                        <th>Endereço</th>
                    </tr>
                </thead>
                <tbody>
                    {businesses.map((business, index) => (
                        <tr key={business.id}>
                            <td>...{business.hash.substring(business.hash.length - 4)}</td>
                            <td>{business.companyName}</td>
                            <td>{business.phone}</td>
                            <td>{business.email}</td>
                            <td>
                                {business.address}, {business.city}/{business.state}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
