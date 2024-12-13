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
    const filterMonth = document.getElementById('filterMonth').value;

    // Filter data berdasarkan bulan (abaikan tahun jika ada)
    const filteredData = data.filter(row => {
        const month = row['Bulan']; // Tidak perlu split karena data hanya bulan
        return (!filterMonth || month === filterMonth); // Filter berdasarkan bulan yang dipilih
    });

    displayTable(filteredData);
    generateCharts(filteredData);

    // Hanya hitung total jika filter bulan tidak diterapkan
    if (!filterMonth) {
        calculateTotals(data);
    } else {
        totalRow.style.display = 'none';
    }
}

function displayTable(data) {
    dataTable.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        dataTable.appendChild(tr);
    });
}

function generateCharts(data) {
    const brands = ['Nike', 'Adidas', 'Puma', 'Vans', 'Converse', 'Reebok', 'Piero'];
    const totalSales = brands.map(brand => {
        return data.reduce((sum, row) => sum + (parseInt(row[brand]) || 0), 0);
    });

    // Pie Chart
    if (salesPieChart) salesPieChart.destroy();
    salesPieChart = new Chart(salesPieChartCanvas, {
        type: 'pie',
        data: {
            labels: brands,
            datasets: [{
                data: totalSales,
                backgroundColor: ['red', 'blue', 'green', 'orange', 'purple', 'pink', 'yellow'],
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false // Menonaktifkan legenda di luar chart
                },
                datalabels: {
                    display: false // Menonaktifkan label data di dalam chart (jika menggunakan chartjs-plugin-datalabels)
                }
            }
        } 
    });

    // Bar Chart
    if (salesBarChart) salesBarChart.destroy();
    salesBarChart = new Chart(salesBarChartCanvas, {
        type: 'bar',
        data: {
            labels: brands,
            datasets: [{
                label: 'Total Penjualan',
                data: totalSales,
                backgroundColor: ['red', 'blue', 'green', 'orange', 'purple', 'pink', 'yellow'],
                borderColor: 'black',
                borderWidth: 1,
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false // Menonaktifkan legenda di luar chart
                },
                datalabels: {
                    display: false // Menonaktifkan label data di dalam chart (jika menggunakan chartjs-plugin-datalabels)
                }
            }
        }
    });
}

function calculateTotals(data) {
    const brands = ['Nike', 'Adidas', 'Puma', 'Vans', 'Converse', 'Reebok', 'Piero'];
    const totals = brands.map(brand => {
        return data.reduce((sum, row) => sum + (parseInt(row[brand]) || 0), 0);
    });

    const totalRowContent = document.createElement('tr');
    totalRowContent.innerHTML = `<td>Total</td>` + totals.map(total => `<td>${total}</td>`).join('');
    
    totalRow.innerHTML = '';
    totalRow.appendChild(totalRowContent);
    totalRow.style.display = 'table-row-group';
}