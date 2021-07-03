function stdNormalDistribution(x) {
    return Math.pow(Math.E, -Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI);
}

let labels = [];
let values = [];

for (let i = 0; i++; i < 100) {
    labels[i] = String(i);
    values[i] = stdNormalDistribution(i);
    console.log(i);
}

const data = {
    labels: labels,
    datasets: [{
        label: 'My First dataset',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: values,
    }]
};
const config = {
    type: 'bar',
    data: data,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
};

let myChart = new Chart(
    document.getElementById('myChart'), config
);
