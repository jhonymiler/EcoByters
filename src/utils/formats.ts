import { formatEther, parseEther } from "viem";

export const getFormattedBalance = (balance: string) => {
        const etherBalance = formatEther(parseEther(balance));
        const [integerPart, decimalPart] = etherBalance.split('.');

        if (!decimalPart) {
            // Se não houver parte decimal, adicionar '00'
            return new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(parseFloat(integerPart));
        }

        // Trunca a parte decimal para duas casas
        const truncatedDecimal = decimalPart.substring(0, 2);

        // Combina a parte inteira com a parte decimal truncada
        const truncatedBalance = `${integerPart}.${truncatedDecimal}`;

        // Formata com locale 'pt-BR' para usar vírgula como separador decimal
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(parseFloat(truncatedBalance));
    };