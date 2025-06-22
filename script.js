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

  const links = document.querySelectorAll(".nav-link");
  const tabs = document.querySelectorAll(".tab-content");

  links.forEach(link => {
    link.addEventListener("click", () => {
      tabs.forEach(tab => tab.classList.remove("active"));
      document.getElementById(link.dataset.tab).classList.add("active");
      document.getElementById("pageTitle").textContent = link.textContent.trim();
    });
  });

  const initialLink = document.querySelector('.nav-link[data-tab="dashboard"]');
  if (initialLink) {
    initialLink.classList.add('bg-primaryLight');
    document.getElementById('dashboard').classList.add('active');
  }

  const ctx = document.getElementById('obligationsChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Cumpridas', 'Pendentes', 'Vencidas', 'Próximas'],
        datasets: [{
          data: [125, 30, 12, 20],
          backgroundColor: ['#32BECB', '#5DACCD', '#9E36EF', '#F59E0B'],
          borderColor: ['#FFFFFF'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          }
        },
        cutout: '70%'
      }
    });
  }
});