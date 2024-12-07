import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useContractPlatform, useRegisterRecycler, useRegisterWasteGenerator } from '@/contracts/managment';
import { signIn, useSession } from 'next-auth/react';
import { useAccount } from 'wagmi';

interface Business {
    companyType?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    city?: string;
    address?: string;
    state?: string;
}

const initialFormData: Business & { hash: string } = {
    companyType: 'geradora',
    companyName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    state: '',
    hash: ''
};

export default function Register() {
    const [formData, setFormData] = useState(initialFormData);
    const { data: session, update } = useSession();
    const { address: userAddress } = useAccount();
    const [isPost, setIsPost] = useState(false);

    const { isPending, isConfirming, isConfirmed, submit } =
        formData.companyType === 'recicladora' ? useRegisterRecycler() : useRegisterWasteGenerator();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Verifica se os dados do formulário estão vazios para decidir a ação
        const isEmpty = Object.values(formData).every(value => value === '' || value === 'geradora');
        if (!isEmpty) {
            await submit();
            setIsPost(true);
        }
    };

    const fetchBusiness = async () => {
        try {
            const response = await fetch('/api/get-business');
            if (response.ok) {
                const data: Business = await response.json();
                if (Object.keys(data).length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        ...data
                    }));
                } else {
                    setFormData(initialFormData);
                }
            } else {
                setFormData(initialFormData);
            }
        } catch (error) {
            console.error("Erro ao buscar empresas:", error);
            setFormData(initialFormData);
        }
    };

    
    useEffect(() => {
        // Quando a transação é confirmada no smart contract e não está registrado ainda
        if (isConfirmed && isPost) {
            const updatedFormData = { ...formData, hash: userAddress };

            const registerCompany = async () => {
                try {
                    const response = await fetch('/api/register-business', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedFormData),
                    });

                    if (response.ok) {
                        const desc = formData.companyType === 'geradora' ? "Geradora de resíduos" : "Recicladora";
                        toast.success(`${desc} cadastrada com sucesso na blockchain! 🎉`);
                        await update(updatedFormData);
                    } else {
                        const errorData = await response.json();
                        toast.error(`Falha no cadastro: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error(error);
                    toast.error('Erro ao se conectar com o servidor.');
                }
            };

            registerCompany();
            setIsPost(false);
            setFormData(formData);

        }
    }, [isConfirmed]);

    useEffect(() => {
        if (session?.user.isRegistered) {
            fetchBusiness();
        } else {
            setFormData(initialFormData);
        }
    }, [session]);



    return (
        <Card>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Check
                                type="radio"
                                label="Recicladora"
                                name="companyType"
                                value="recicladora"
                                checked={formData.companyType === 'recicladora'}
                                onChange={handleChange}
                                inline
                            />
                            <Form.Check
                                type="radio"
                                label="Geradora de Resíduos"
                                name="companyType"
                                value="geradora"
                                checked={formData.companyType === 'geradora'}
                                onChange={handleChange}
                                inline
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Razão Social</Form.Label>
                            <Form.Control
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Telefone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Cidade</Form.Label>
                            <Form.Control
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Endereço</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group as={Col} className="mb-4">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione...</option>
                            <option value="AC">Acre</option>
                            <option value="AL">Alagoas</option>
                            <option value="AP">Amapá</option>
                            <option value="AM">Amazonas</option>
                            <option value="BA">Bahia</option>
                            <option value="CE">Ceará</option>
                            <option value="DF">Distrito Federal</option>
                            <option value="ES">Espírito Santo</option>
                            <option value="GO">Goiás</option>
                            <option value="MA">Maranhão</option>
                            <option value="MT">Mato Grosso</option>
                            <option value="MS">Mato Grosso do Sul</option>
                            <option value="MG">Minas Gerais</option>
                            <option value="PA">Pará</option>
                            <option value="PB">Paraíba</option>
                            <option value="PR">Paraná</option>
                            <option value="PE">Pernambuco</option>
                            <option value="PI">Piauí</option>
                            <option value="RJ">Rio de Janeiro</option>
                            <option value="RN">Rio Grande do Norte</option>
                            <option value="RS">Rio Grande do Sul</option>
                            <option value="RO">Rondônia</option>
                            <option value="RR">Roraima</option>
                            <option value="SC">Santa Catarina</option>
                            <option value="SP">São Paulo</option>
                            <option value="SE">Sergipe</option>
                            <option value="TO">Tocantins</option>
                        </Form.Select>
                    </Form.Group>
                    {isConfirming && <div>Aguardando confirmação da transação...</div>}
                    <Button type="submit" className="mt-4" variant="success" disabled={isPending}>
                        {isPending ? "Processando..." : "Cadastrar"}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}
