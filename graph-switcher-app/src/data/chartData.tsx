// src/data/chartData.js
export const chartData = [
    { date: "2024-01-01", quantity: 120, price: 500 },
    { date: "2024-02-01", quantity: 150, price: 520 },
    { date: "2024-03-01", quantity: 100, price: 480 },
    { date: "2024-04-01", quantity: 180, price: 550 },
    { date: "2024-05-01", quantity: 130, price: 510 },
    { date: "2024-06-01", quantity: 160, price: 530 },
    { date: "2024-07-01", quantity: 110, price: 490 },
    { date: "2024-08-01", quantity: 170, price: 540 },
    { date: "2024-09-01", quantity: 140, price: 515 },
    { date: "2024-10-01", quantity: 190, price: 560 },
    { date: "2024-11-01", quantity: 125, price: 505 },
    { date: "2024-12-01", quantity: 200, price: 580 }
];

export const labels = chartData.map(d => new Date(d.date).toLocaleDateString('ja-JP', { month: 'short' }));
export const quantityData = chartData.map(d => d.quantity);
export const priceData = chartData.map(d => d.price);
