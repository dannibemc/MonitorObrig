document.addEventListener("DOMContentLoaded", () => {
  const db = window.firebaseDB;

  async function carregarDadosDashboard() {
    try {
      const contratosSnap = await db.collection("contratos").get();
      const obrigacoesSnap = await db.collection("obrigacoes").get();

      document.querySelector("#dashboard .card:nth-child(1) h3").textContent = contratosSnap.size;
      document.querySelector("#dashboard .card:nth-child(2) h3").textContent = obrigacoesSnap.size;

      const alertas = obrigacoesSnap.docs.filter(doc => doc.data().status === "vencido");
      document.querySelector("#dashboard .card:nth-child(3) h3").textContent = alertas.length;
    } catch (error) {
      console.error("Erro ao carregar dados do Firebase:", error);
    }
  }

  carregarDadosDashboard();

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
      document.getElementById(link.dataset.tab).classList.add("active");
      document.querySelector("#pageTitle").textContent = link.textContent;
    });
  });

  const btn = document.getElementById("btnSalvar");
  if (btn) {
    btn.addEventListener("click", async () => {
      const nome = document.getElementById("nome").value;
      const empresa = document.getElementById("empresa").value;
      const data_inicio = document.getElementById("data_inicio").value;
      if (!nome || !empresa || !data_inicio) return alert("Preencha todos os campos.");
      await db.collection("contratos").add({ nome, empresa, data_inicio });
      alert("Contrato salvo!");
      document.getElementById("nome").value = "";
      document.getElementById("empresa").value = "";
      document.getElementById("data_inicio").value = "";
      carregarDadosDashboard();
    });
  }

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