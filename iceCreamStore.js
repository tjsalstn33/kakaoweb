let iceCreamFlavors = [
    { name: "Chocolate", type: "Chocolate", price: 2},
    { name: "Strawberry", type: "Fruit", price: 1},
    { name: "Vanilla", type: "Vanilla", price:2},
    { name: "Pistachio", type: "Nuts", price: 1.5},
    { name: "Neapolitan", type: "Chocolate", price: 2},
    { name: "Mint Chip", type: "Chocolate", price: 1.5},
    { name: "Raspberry", type: "Fruit", price: 1},
];

let transactions = []

transactions.push({ scoops: ["Chocolate", "Vanilla", "Mint Chip"], total: 5.5})
transactions.push({ scoops: ["Raspberry", "Strawberry"], total: 2})
transactions.push({ scoops: ["Vanilla", "Vanilla"], total: 4})

const total = transactions.reduce((acc,curr) => acc + curr.total, 0);
console.log(`You've made ${total} $ today`);

let flavorDistribution = transactions.reduce((acc, curr) => {
    curr.scoops.forEach(scoop => {
        if (!acc[scoop]) {
            acc[scoop] = 0;
        }
        acc[scoop]++;
    })
    return acc;
}, {})
console.log(flavorDistribution);

let mostSell = Object.keys(flavorDistribution).reduce((mostSell, flavor) => {
    if (flavorDistribution[flavor] > flavorDistribution[mostSell]) {
        return flavor;
    }
    return mostSell;
}, Object.keys(flavorDistribution)[0]);
console.log(`Most sell is ${mostSell}`);