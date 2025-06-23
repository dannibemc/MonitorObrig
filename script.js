document.addEventListener("DOMContentLoaded", () => {
  const db = window.firebaseDB;

  async function carregarDashboard() {
    const contratosSnap = await db.collection("contratos").get();
    const obrigacoesSnap = await db.collection("obrigacoes").get();
    const alertas = obrigacoesSnap.docs.filter(doc => doc.data().status === "vencido");

    document.querySelector("#dashboard .grid div:nth-child(1) h2").textContent = contratosSnap.size;
    document.querySelector("#dashboard .grid div:nth-child(2) h2").textContent = obrigacoesSnap.size;
    document.querySelector("#dashboard .grid div:nth-child(3) h2").textContent = alertas.length;
  }

  async function carregarContratos() {
    const lista = document.getElementById("listaContratos");
    lista.innerHTML = "<li>Carregando...</li>";
    const snapshot = await db.collection("contratos").orderBy("data_inicio", "desc").get();

    if (snapshot.empty) {
      lista.innerHTML = "<li class='text-gray-500'>Nenhum contrato encontrado.</li>";
      return;
    }

    lista.innerHTML = "";
    snapshot.forEach(doc => {
      const { nome, empresa, data_inicio, data_fim, valor } = doc.data();
      const li = document.createElement("li");
      li.className = "border-b py-1";
      li.textContent = `${nome} (${empresa}) - ${data_inicio} até ${data_fim} | R$ ${valor}`;
      lista.appendChild(li);
    });
  }

  async function salvarContrato() {
    const nome = document.getElementById("nome").value;
    const empresa = document.getElementById("empresa").value;
    const data_inicio = document.getElementById("data_inicio").value;
    const data_fim = document.getElementById("data_fim").value;
    const valor = parseFloat(document.getElementById("valor").value || 0);

    if (!nome || !empresa || !data_inicio || !data_fim) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    await db.collection("contratos").add({ nome, empresa, data_inicio, data_fim, valor });
    alert("Contrato salvo com sucesso!");

    document.getElementById("nome").value = "";
    document.getElementById("empresa").value = "";
    document.getElementById("data_inicio").value = "";
    document.getElementById("data_fim").value = "";
    document.getElementById("valor").value = "";

    carregarDashboard();
    carregarContratos();
  }

  const btn = document.getElementById("btnSalvar");
  if (btn) btn.addEventListener("click", salvarContrato);

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
      document.getElementById(link.dataset.tab).classList.add("active");
      document.getElementById("pageTitle").textContent = link.textContent.trim();

      if (link.dataset.tab === "contratos") carregarContratos();
      if (link.dataset.tab === "dashboard") carregarDashboard();
    });
  });

  carregarDashboard();

  const ctx = document.getElementById('obligationsChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Cumpridas', 'Pendentes', 'Vencidas', 'Próximas'],
        datasets: [{
          data: [10, 5, 2, 3],
          backgroundColor: ['#32BECB', '#5DACCD', '#9E36EF', '#F59E0B'],
          borderColor: ['#FFFFFF'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        cutout: '70%'
      }
    });
  }
});