document.addEventListener('DOMContentLoaded', function () {
    //
    // **************************************************
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5fjInhHn8fIXUr5oho-REt9mVPz4LtT4",
  authDomain: "monitorobrig.firebaseapp.com",
  projectId: "monitorobrig",
  storageBucket: "monitorobrig.firebasestorage.app",
  messagingSenderId: "883420122335",
  appId: "1:883420122335:web:dce66a89889ad64bdfed6a",
  measurementId: "G-E063C7FYXR"
};
    // **************************************************
    const firebaseConfig = {
        apiKey: "SUA_API_KEY",
        authDomain: "SEU_AUTH_DOMAIN",
        projectId: "SEU_PROJECT_ID",
        storageBucket: "SEU_STORAGE_BUCKET",
        messagingSenderId: "SEU_MESSAGING_SENDER_ID",
        appId: "SUA_APP_ID"
    };

    // Inicializa o Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Referências do DOM
    const formNovoContrato = document.getElementById('form-novo-contrato');
    const tabelaBody = document.getElementById('tabela-contratos-body');

    // --- FUNÇÃO PARA CARREGAR CONTRATOS NA TABELA ---
    const carregarContratos = async () => {
        // Limpa a tabela antes de carregar novos dados
        tabelaBody.innerHTML = '';
        
        try {
            const querySnapshot = await db.collection("contratos").orderBy("nome").get();
            querySnapshot.forEach((doc) => {
                const contrato = doc.data();
                
                // Formata as datas para o padrão brasileiro
                const dataFimFormatada = new Date(contrato.dataFim + 'T00:00:00').toLocaleDateString('pt-BR');
                
                const linhaTabela = `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900">${contrato.nome}</div>
                            <div class="text-sm text-gray-500">${contrato.empresa}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">${dataFimFormatada}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary bg-opacity-10 text-secondary">Em dia</span>
                        </td>
                    </tr>
                `;
                tabelaBody.innerHTML += linhaTabela;
            });
        } catch (error) {
            console.error("Erro ao carregar contratos: ", error);
            alert("Não foi possível carregar os contratos.");
        }
    };

    // --- EVENT LISTENER PARA O FORMULÁRIO ---
    formNovoContrato.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        // Pega os valores do formulário
        const nome = document.getElementById('contrato-nome').value;
        const empresa = document.getElementById('contrato-empresa').value;
        const dataInicio = document.getElementById('contrato-inicio').value;
        const dataFim = document.getElementById('contrato-fim').value;
        const valor = document.getElementById('contrato-valor').value;

        try {
            // Adiciona um novo documento à coleção 'contratos'
            await db.collection("contratos").add({
                nome: nome,
                empresa: empresa,
                dataInicio: dataInicio,
                dataFim: dataFim,
                valor: valor
            });
            
            alert('Contrato salvo com sucesso!');
            formNovoContrato.reset(); // Limpa o formulário
            carregarContratos(); // Recarrega a tabela para mostrar o novo contrato
            
        } catch (error) {
            console.error("Erro ao salvar contrato: ", error);
            alert("Ocorreu um erro ao salvar o contrato.");
        }
    });

    // Carrega os contratos existentes quando a página é aberta
    carregarContratos();
});