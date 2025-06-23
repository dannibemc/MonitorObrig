const { useState, useEffect, useRef } = React;

// Dados do sistema
const creditData = [
    { 
        id: "#CR-7845", 
        client: "Empresa ABC Ltda.", 
        cnpj: "12.345.678/0001-90", 
        type: "Imobiliário", 
        value: 1250000, 
        rate: 12.5, 
        status: "Adimplente", 
        progress: 75, 
        riskScore: 80, 
        serasaRating: "AA",
        sector: "Construção Civil",
        pdd: 1.2,
        recoveryRate: 85,
        collateral: [
            { type: "Imóvel", value: 1800000, description: "Apartamento Comercial - São Paulo" }
        ],
        covenants: [
            { type: "Endividamento Líquido/EBITDA", limit: 3.5, current: 2.8, status: "OK" }
        ],
        alerts: []
    },
    { 
        id: "#CR-7844", 
        client: "Construtora XYZ S.A.", 
        cnpj: "98.765.432/0001-12", 
        type: "Corporativo", 
        value: 3750000, 
        rate: 14.2, 
        status: "Em Atraso", 
        progress: 45, 
        riskScore: 60, 
        serasaRating: "BB",
        sector: "Construção Civil",
        pdd: 8.5,
        recoveryRate: 65,
        collateral: [
            { type: "Equipamentos", value: 4200000, description: "Maquinário Industrial" }
        ],
        covenants: [
            { type: "Endividamento Líquido/EBITDA", limit: 3.5, current: 4.1, status: "BREACH" }
        ],
        alerts: ["Atraso de pagamento detectado", "Covenant violado"]
    },
    { 
        id: "#CR-7843", 
        client: "Indústrias Silva Ltda.", 
        cnpj: "45.678.901/0001-23", 
        type: "Industrial", 
        value: 2100000, 
        rate: 13.8, 
        status: "Inadimplente", 
        progress: 30, 
        riskScore: 40, 
        serasaRating: "CC",
        sector: "Manufatura",
        pdd: 15.2,
        recoveryRate: 45,
        collateral: [
            { type: "Estoque", value: 1200000, description: "Matéria-prima industrial" }
        ],
        covenants: [
            { type: "Endividamento Líquido/EBITDA", limit: 3.5, current: 5.2, status: "BREACH" }
        ],
        alerts: ["Inadimplência confirmada", "Risco de vencimento antecipado"]
    }
];

const CreditMonitoringSystem = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [selectedCredit, setSelectedCredit] = useState(null);
    const [filteredCredits, setFilteredCredits] = useState(creditData);

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    }).format(value);

    const calculateRealTimeScore = (credit) => {
        let score = credit.riskScore;
        const breachedCovenants = credit.covenants?.filter(c => c.status === "BREACH").length || 0;
        score -= breachedCovenants * 15;
        if (credit.status === "Inadimplente") score -= 20;
        if (credit.status === "Em Atraso") score -= 10;
        return Math.max(Math.min(Math.round(score), 100), 0);
    };

    const checkEarlyMaturityTriggers = (credit) => {
        const triggers = [];
        if (credit.status === "Inadimplente") {
            triggers.push("Inadimplência confirmada");
        }
        const breachedCovenants = credit.covenants?.filter(c => c.status === "BREACH") || [];
        breachedCovenants.forEach(covenant => {
            triggers.push(`Covenant violado: ${covenant.type}`);
        });
        return triggers;
    };

    const generateCVMReport = () => {
        const reportData = creditData.map(credit => ({
            ID: credit.id,
            Cliente: credit.client,
            CNPJ: credit.cnpj,
            Valor: credit.value,
            Status: credit.status,
            RiskScore: calculateRealTimeScore(credit),
            PDD: credit.pdd,
            Setor: credit.sector
        }));
        
        const headers = Object.keys(reportData[0]).join(',');
        const rows = reportData.map(row => Object.values(row).join(','));
        const csv = [headers, ...rows].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'relatorio_cvm.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Cálculos para KPIs
    const totalCredits = creditData.reduce((acc, credit) => acc + credit.value, 0);
    const totalPDD = creditData.reduce((acc, credit) => acc + (credit.value * credit.pdd / 100), 0);
    const avgRecoveryRate = creditData.reduce((acc, credit) => acc + credit.recoveryRate, 0) / creditData.length;
    const defaultRate = (creditData.filter(c => c.status === "Inadimplente").length / creditData.length * 100).toFixed(1);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <div className="gradient-bg w-10 h-10 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">SC</span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-800">SecuriCredit Monitor</h1>
                        </div>
                        <nav className="flex space-x-6">
                            <button 
                                className={`px-4 py-2 rounded-md transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800'}`}
                                onClick={() => setActiveTab('dashboard')}
                            >
                                Dashboard
                            </button>
                            <button 
                                className={`px-4 py-2 rounded-md transition ${activeTab === 'credits' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800'}`}
                                onClick={() => setActiveTab('credits')}
                            >
                                Créditos
                            </button>
                            <button 
                                className={`px-4 py-2 rounded-md transition ${activeTab === 'analysis' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800'}`}
                                onClick={() => setActiveTab('analysis')}
                            >
                                Análise
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Dashboard Executivo</h2>
                            <button 
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                onClick={generateCVMReport}
                            >
                                📊 Relatório CVM
                            </button>
                        </div>

                        {/* KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border card-hover">
                                <h3 className="text-sm text-gray-500 mb-1">Total de Créditos</h3>
                                <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalCredits)}</p>
                                <p className="text-sm text-green-600 mt-2">+8.2% desde o mês passado</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border card-hover">
                                <h3 className="text-sm text-gray-500 mb-1">PDD Total</h3>
                                <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalPDD)}</p>
                                <p className="text-sm text-red-600 mt-2">+0.5% desde o mês passado</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border card-hover">
                                <h3 className="text-sm text-gray-500 mb-1">Recovery Rate</h3>
                                <p className="text-2xl font-bold text-gray-800">{avgRecoveryRate.toFixed(1)}%</p>
                                <p className="text-sm text-green-600 mt-2">+3.2% desde o mês passado</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border card-hover">
                                <h3 className="text-sm text-gray-500 mb-1">Taxa de Inadimplência</h3>
                                <p className="text-2xl font-bold text-gray-800">{defaultRate}%</p>
                                <p className="text-sm text-yellow-600 mt-2">Monitorar tendência</p>
                            </div>
                        </div>

                        {/* Lista de Créditos */}
                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="p-6 border-b">
                                <h3 className="font-semibold text-gray-800">Créditos Ativos</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-responsive">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {creditData.map(credit => {
                                            const realTimeScore = calculateRealTimeScore(credit);
                                            return (
                                                <tr key={credit.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{credit.id}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">{credit.client}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">{formatCurrency(credit.value)}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        <div className="flex items-center">
                                                            <span className={`risk-indicator ${realTimeScore >= 70 ? 'risk-low' : realTimeScore >= 50 ? 'risk-medium' : 'risk-high'}`}></span>
                                                            {realTimeScore}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${credit.status === 'Adimplente' ? 'bg-green-100 text-green-800' : credit.status === 'Em Atraso' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                            {credit.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button 
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                            onClick={() => setSelectedCredit(credit)}
                                                        >
                                                            Ver Detalhes
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Credits Tab */}
                {activeTab === 'credits' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestão de Créditos</h2>
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="font-semibold mb-4">Lista de Operações</h3>
                            <div className="space-y-4">
                                {creditData.map(credit => (
                                    <div key={credit.id} className="border rounded-lg p-4 card-hover">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-lg">{credit.client}</h4>
                                                <p className="text-sm text-gray-600">{credit.id} - {credit.type}</p>
                                                <p className="text-sm text-gray-600">Valor: {formatCurrency(credit.value)}</p>
                                                <p className="text-sm text-gray-600">Taxa: {credit.rate}% a.a.</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${credit.status === 'Adimplente' ? 'bg-green-100 text-green-800' : credit.status === 'Em Atraso' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                    {credit.status}
                                                </span>
                                                <p className="text-sm text-gray-600 mt-1">Score: {calculateRealTimeScore(credit)}</p>
                                            </div>
                                        </div>
                                        {credit.alerts.length > 0 && (
                                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                                                <p className="text-sm text-red-800 font-medium">⚠️ Alertas:</p>
                                                <ul className="text-sm text-red-700 mt-1">
                                                    {credit.alerts.map((alert, index) => (
                                                        <li key={index}>• {alert}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Analysis Tab */}
                {activeTab === 'analysis' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Análise Avançada</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h3 className="font-semibold mb-4">Score em Tempo Real</h3>
                                <div className="space-y-3">
                                    {creditData.map(credit => {
                                        const realTimeScore = calculateRealTimeScore(credit);
                                        return (
                                            <div key={credit.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                                <span className="font-medium">{credit.client}</span>
                                                <div className="flex items-center">
                                                    <span className={`risk-indicator ${realTimeScore >= 70 ? 'risk-low' : realTimeScore >= 50 ? 'risk-medium' : 'risk-high'}`}></span>
                                                    <span className="font-bold">{realTimeScore}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h3 className="font-semibold mb-4">Triggers de Vencimento Antecipado</h3>
                                <div className="space-y-3">
                                    {creditData.map(credit => {
                                        const triggers = checkEarlyMaturityTriggers(credit);
                                        return (
                                            <div key={credit.id} className={`p-3 rounded border ${triggers.length > 0 ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{credit.client}</span>
                                                    {triggers.length > 0 ? (
                                                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-semibold">
                                                            {triggers.length} trigger(s)
                                                        </span>
                                                    ) : (
                                                        <span className="text-green-600 text-sm font-semibold">✓ OK</span>
                                                    )}
                                                </div>
                                                {triggers.length > 0 && (
                                                    <ul className="mt-2 text-sm text-red-700">
                                                        {triggers.map((trigger, index) => (
                                                            <li key={index}>• {trigger}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Covenants */}
                        <div className="mt-6 bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="p-6 border-b">
                                <h3 className="font-semibold">Monitoramento de Covenants</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-responsive">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Covenant</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limite</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Atual</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {creditData.map(credit => 
                                            credit.covenants?.map((covenant, index) => (
                                                <tr key={`${credit.id}-${index}`} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm font-medium">{credit.client}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">{covenant.type}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">{covenant.limit}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">{covenant.current}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${covenant.status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {covenant.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Modal de Detalhes */}
            {selectedCredit && (
                <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50" onClick={() => setSelectedCredit(null)}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">Detalhes do Crédito {selectedCredit.id}</h3>
                            <button className="text-gray-400 hover:text-gray-600" onClick={() => setSelectedCredit(null)}>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-3">Informações Básicas</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Cliente:</span>
                                            <span className="font-medium">{selectedCredit.client}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">CNPJ:</span>
                                            <span className="font-medium">{selectedCredit.cnpj}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tipo:</span>
                                            <span className="font-medium">{selectedCredit.type}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Valor:</span>
                                            <span className="font-medium">{formatCurrency(selectedCredit.value)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Taxa:</span>
                                            <span className="font-medium">{selectedCredit.rate}% a.a.</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Score Atual:</span>
                                            <span className="font-medium">{calculateRealTimeScore(selectedCredit)}/100</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">PDD:</span>
                                            <span className="font-medium">{selectedCredit.pdd}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-3">Garantias</h4>
                                    <div className="space-y-2">
                                        {selectedCredit.collateral?.map((item, index) => (
                                            <div key={index} className="p-3 border rounded">
                                                <div className="flex justify-between items-start">
                                                    <span className="font-medium">{item.type}</span>
                                                    <span className="text-green-600 font-bold">{formatCurrency(item.value)}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {selectedCredit.alerts.length > 0 && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
                                    <h4 className="font-semibold text-red-800 mb-2">Alertas Ativos</h4>
                                    <ul className="text-sm text-red-700">
                                        {selectedCredit.alerts.map((alert, index) => (
                                            <li key={index}>• {alert}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-6 flex justify-end space-x-3">
                                <button className="px-4 py-2 border rounded hover:bg-gray-50">
                                    📄 Exportar Relatório
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    📧 Enviar Notificação
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <footer className="bg-white border-t py-4 mt-8">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    © 2025 SecuriCredit Monitor - Sistema de Monitoramento de Crédito
                </div>
            </footer>
        </div>
    );
};

ReactDOM.render(<CreditMonitoringSystem />, document.getElementById('root'));
