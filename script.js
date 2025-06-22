document.addEventListener('DOMContentLoaded', function () {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('pageTitle');

    // Toggle sidebar on mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }

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