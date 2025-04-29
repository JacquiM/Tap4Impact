
let amount = 0;
function updateDonation() {
    amount += Math.floor(Math.random() * 500) + 100; // simulate donation
    document.getElementById("donation-amount").innerText = `R${amount.toLocaleString()} donated`;
    let height = Math.min(100, amount / 1000); // simple scale
    document.getElementById("sand").style.height = height + "%";
}
setInterval(updateDonation, 2000);
