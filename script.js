// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// script.js
document.addEventListener("DOMContentLoaded", () => {
async function carregarDadosDashboard() {
  const contratosSnap = await getDocs(collection(db, "contratos"));
  const obrigacoesSnap = await getDocs(collection(db, "obrigacoes"));

  document.querySelector("#dashboard .card:nth-child(1) h3").textContent = contratosSnap.size;
  document.querySelector("#dashboard .card:nth-child(2) h3").textContent = obrigacoesSnap.size;

  const alertas = obrigacoesSnap.docs.filter(doc => doc.data().status === "vencido");
  document.querySelector("#dashboard .card:nth-child(3) h3").textContent = alertas.length;
}

carregarDadosDashboard();

  // Alterna abas
  const links = document.querySelectorAll(".nav-link");
  const tabs = document.querySelectorAll(".tab-content");

  links.forEach(link => {
    link.addEventListener("click", () => {
      tabs.forEach(tab => tab.classList.remove("active"));
      document.getElementById(link.dataset.tab).classList.add("active");

      // Atualiza título
      document.getElementById("pageTitle").textContent = link.textContent.trim();
    });
  });

  // Firebase já carregado no index.html
  // Aqui adicionaremos integração dinâmica (em breve)
});

    // Tab switching logic
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            
            // Update page title
            const linkText = link.querySelector('span').textContent;
            pageTitle.textContent = linkText;

            // Update active link
            navLinks.forEach(l => l.classList.remove('bg-primaryLight'));
            link.classList.add('bg-primaryLight');

            // Show correct tab content
            tabContents.forEach(content => {
                if (content.id === tabId) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

    // Set initial active link and content
    const initialLink = document.querySelector('.nav-link[data-tab="dashboard"]');
    if(initialLink) {
        initialLink.classList.add('bg-primaryLight');
        document.getElementById('dashboard').classList.add('active');
    }
    

    // Chart.js - Obrigações por Status
    const ctx = document.getElementById('obligationsChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Cumpridas', 'Pendentes', 'Vencidas', 'Próximas'],
                datasets: [{
                    label: 'Obrigações',
                    data: [125, 30, 12, 20], // Dados de exemplo
                    backgroundColor: [
                        '#32BECB', // secondary
                        '#5DACCD', // tertiary
                        '#9E36EF', // accent
                        '#F59E0B'  // Amarelo para 'Próximas'
                    ],
                    borderColor: [
                        '#FFFFFF'
                    ],
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
