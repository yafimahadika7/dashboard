const dataTable = document.getElementById('data-table').querySelector('tbody');
const totalRow = document.getElementById('totalRow');
const salesPieChartCanvas = document.getElementById('salesPieChart');
const salesBarChartCanvas = document.getElementById('salesBarChart');
let data = [];
let salesPieChart;
let salesBarChart;

function loadCSV() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Silakan pilih file CSV.');
        return;
    }

    Papa.parse(file, {
        complete: function (results) {
            console.log("Data yang dimuat:", results.data);  // Menampilkan hasil parsing
            data = results.data;
            displayTable(data);
            generateCharts(data);
            calculateTotals(data);
        },
        header: true, // Menganggap baris pertama sebagai header
        skipEmptyLines: true  // Melewatkan baris kosong
    });
}

function applyFilters() {
    const filterYear = document.getElementById('filterYear').value;  // Menambahkan filter berdasarkan tahun

    const filteredData = data.filter(row => {
        const year = row['Tahun'];
        return !filterYear || year === filterYear;  // Filter berdasarkan tahun
    });

    if (filteredData.length === 0) {
        alert('Data tidak ditemukan untuk tahun yang dipilih.');
        return;
    }

    displayTable(filteredData);
    generateCharts(filteredData, filterYear);  // Kirim data dan tahun yang difilter ke generateCharts
}


function displayTable(data) {
    dataTable.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(cell => {
            const td = document.createElement('td');
            // Cek apakah nilai adalah angka
            if (!isNaN(cell)) {
                td.textContent = parseFloat(cell).toLocaleString('id-ID');  // Memformat angka dengan pemisah ribuan titik
            } else {
                td.textContent = cell;  // Jika bukan angka, tampilkan langsung
            }
            tr.appendChild(td);
        });
        dataTable.appendChild(tr);
    });
}

function generateCharts(data, filterYear) {
    if (salesBarChart) salesBarChart.destroy();

    // Label bulan
    const labels = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    // Filter data per tahun
    let year2022 = data.find(row => row['Tahun'] === '2022');
    let year2023 = data.find(row => row['Tahun'] === '2023');

    // Pastikan hanya grafik yang sesuai dengan filter yang ditampilkan
    let values2022 = [];
    let values2023 = [];

    if (filterYear === '2023') {
        // Ambil nilai penjualan untuk 2023 saja
        values2023 = labels.map(month => parseFloat(year2023[month]) || 0);
    } else if (filterYear === '2022') {
        // Ambil nilai penjualan untuk 2022 saja
        values2022 = labels.map(month => parseFloat(year2022[month]) || 0);
    } else {
        // Ambil nilai penjualan untuk kedua tahun jika tidak ada filter
        values2022 = labels.map(month => parseFloat(year2022[month]) || 0);
        values2023 = labels.map(month => parseFloat(year2023[month]) || 0);
    }

    // Konfigurasi bar chart
    salesBarChart = new Chart(salesBarChartCanvas, {
        type: 'bar',
        data: {
            labels: labels,  // Label bulan
            datasets: [
                {
                    label: '2022',
                    data: values2022,  // Data penjualan untuk 2022
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',  // Warna biru
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    hidden: filterYear === '2023'  // Sembunyikan dataset 2022 jika filter 2023
                },
                {
                    label: '2023',
                    data: values2023,  // Data penjualan untuk 2023
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',  // Warna merah
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    hidden: filterYear === '2022'  // Sembunyikan dataset 2023 jika filter 2022
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
                    beginAtZero: true,  // Mulai dari 0
                    ticks: {
                        stepSize: 2500,  // Interval antar angka pada sumbu Y
                        callback: function(value) {
                            return value.toLocaleString();  // Menampilkan angka dengan pemisah ribuan
                        }
                    },
                    max: 10000  // Batas maksimum sumbu Y
                }
            }
        }
    });
}