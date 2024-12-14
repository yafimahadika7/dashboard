// Deklarasi elemen HTML
const dataTable = document.getElementById('data-table').querySelector('tbody');
const salesBarChartCanvas = document.getElementById('salesBarChart');

// Deklarasi variabel global untuk grafik
let salesBarChart;

// Data penjualan
let data = [
    {
        "Tahun": "2022",
        "Januari": "4017",
        "Februari": "6135",
        "Maret": "7091",
        "April": "5841",
        "Mei": "5036",
        "Juni": "4547",
        "Juli": "3467",
        "Agustus": "3970",
        "September": "6313",
        "Oktober": "3595",
        "November": "9207",
        "Desember": "5945"
    },
    {
        "Tahun": "2023",
        "Januari": "2416",
        "Februari": "4136",
        "Maret": "7935",
        "April": "8004",
        "Mei": "9505",
        "Juni": "5026",
        "Juli": "6108",
        "Agustus": "6343",
        "September": "9404",
        "Oktober": "9280",
        "November": "9287",
        "Desember": "8689"
    }
];

// Fungsi untuk menerapkan filter berdasarkan tahun
function applyFilters() {
    const filterYear = document.getElementById('filterYear').value;

    let filteredData = [];
    if (filterYear === "all") {
        filteredData = data;
    } else {
        filteredData = data.filter(row => row['Tahun'] === filterYear);
    }

    if (filteredData.length === 0) {
        alert('Data tidak ditemukan untuk tahun yang dipilih.');
        return;
    }

    displayTable(filteredData);
    generateCharts(filteredData, filterYear);
}

// Fungsi untuk menampilkan data dalam tabel
function displayTable(data) {
    dataTable.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        Object.keys(row).forEach(key => {
            const td = document.createElement('td');
            if (key !== 'Tahun' && !isNaN(row[key])) {
                td.textContent = parseFloat(row[key]).toLocaleString('id-ID');
            } else {
                td.textContent = row[key]; // Tidak diformat untuk tahun
            }
            tr.appendChild(td);
        });
        dataTable.appendChild(tr);
    });
}

// Fungsi untuk membuat/memperbarui grafik
function generateCharts(data, filterYear) {
    if (salesBarChart) {
        salesBarChart.destroy();
    }

    const labels = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    let year2022 = data.find(row => row['Tahun'] === '2022');
    let year2023 = data.find(row => row['Tahun'] === '2023');

    let values2022 = year2022 ? labels.map(month => parseFloat(year2022[month]) || 0) : [];
    let values2023 = year2023 ? labels.map(month => parseFloat(year2023[month]) || 0) : [];

    salesBarChart = new Chart(salesBarChartCanvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '2022', // Tetap sebagai string
                    data: values2022,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    hidden: filterYear === '2023'
                },
                {
                    label: '2023', // Tetap sebagai string
                    data: values2023,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    hidden: filterYear === '2022'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Laporan Penjualan'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 2500,
                        callback: function(value) {
                            return value.toLocaleString('id-ID'); // Pemformatan hanya untuk nilai
                        }
                    },
                    max: 10000
                }
            }
        }
    });
}



// Jalankan fungsi applyFilters saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    applyFilters();
});