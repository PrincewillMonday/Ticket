// // Scroll to tickets
// function scrollToTickets(){
//     document.getElementById('tickets').scrollIntoView({behavior:'smooth'});
// }

// // Copy function
// function copyToClipboard(text){
//     navigator.clipboard.writeText(text);
//     alert(text + " copied to clipboard!");
// }

// // Generate unique ticket number
// function generateTicketNumber() {
//     const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
//     const random = Math.floor(Math.random() * 900 + 100); // 3-digit random number
//     return `FASHION-${timestamp}-${random}`;
// }

// // Ticket selection
// let currentTicket = "";
// let currentPrice = 0;
// function selectTicket(type, price){
//     currentTicket = type;
//     currentPrice = price;
//     document.getElementById('selectedTicket').value = type;
//     document.getElementById('unitPrice').value = price;
//     document.getElementById('totalAmount').value = price * document.getElementById('quantity').value;
//     document.getElementById('formSection').classList.add('active');
//     document.getElementById('quantity').addEventListener('input', updateTotal);
//     document.getElementById('quantity').scrollIntoView({behavior:'smooth'});
// }

// function updateTotal(){
//     const qty = parseInt(document.getElementById('quantity').value);
//     document.getElementById('totalAmount').value = currentPrice * qty;
// }

// // Form submission
// document.getElementById('purchaseForm').addEventListener('submit', async function(e){
//     e.preventDefault();
//     const btn = document.getElementById('submitBtn');
//     btn.disabled = true;
//     btn.innerText = "Submitting...";

//     const ticketNumber = generateTicketNumber(); // Generate ticket number

//     const formData = {
//         ticketType: currentTicket,
//         ticketNumber: ticketNumber, // include ticket number
//         unitPrice: currentPrice,
//         quantity: parseInt(document.getElementById('quantity').value),
//         totalAmount: currentPrice * parseInt(document.getElementById('quantity').value),
//         fullName: document.getElementById('fullName').value,
//         email: document.getElementById('email').value,
//         phone: document.getElementById('phone').value,
//         paymentReference: document.getElementById('paymentReference').value,
//         accountName: document.getElementById('accountNameUser').value,
//         paymentDate: document.getElementById('paymentDate').value
//     };

//     try {
//         await fetch("https://script.google.com/macros/s/AKfycbxaSxX1Y3OWiKlqo2X4d6O64-sM7pzbWbKNPx5VGlQcsJJ04sSuC3wfBX-BBKf6q4Yx/exec", {
//             method:"POST",
//             body: JSON.stringify(formData)
//         });

//         btn.disabled = false;
//         btn.innerText = "Submit Confirmation";
//         document.getElementById('purchaseForm').reset();
//         showSuccess();

//         // Optional: alert user of ticket number immediately
//         alert(`Your ticket number is ${ticketNumber}. Check your email for confirmation and PDF ticket.`);

//     } catch(err){
//         alert("Error submitting. Try again.");
//         btn.disabled = false;
//         btn.innerText = "Submit Confirmation";
//     }
// });

// // Success modal
// function showSuccess(){
//     document.getElementById('overlay').classList.add('active');
//     document.getElementById('successModal').classList.add('active');
// }

// function closeModal(){
//     document.getElementById('overlay').classList.remove('active');
//     document.getElementById('successModal').classList.remove('active');
// }





// Scroll to tickets
function scrollToTickets(){
    document.getElementById('tickets').scrollIntoView({behavior:'smooth'});
}

// Copy function
function copyToClipboard(text){
    navigator.clipboard.writeText(text);
    alert(text + " copied to clipboard!");
}

// Generate unique ticket number
function generateTicketNumber() {
    const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
    const random = Math.floor(Math.random() * 900 + 100); // 3-digit random number
    return `FASHION-${timestamp}-${random}`;
}

// Ticket selection
let currentTicket = "";
let currentPrice = 0;
function selectTicket(type, price){
    currentTicket = type;
    currentPrice = price;
    document.getElementById('selectedTicket').value = type;
    document.getElementById('unitPrice').value = price;
    document.getElementById('totalAmount').value = price * document.getElementById('quantity').value;
    document.getElementById('formSection').classList.add('active');
    document.getElementById('quantity').addEventListener('input', updateTotal);
    document.getElementById('quantity').scrollIntoView({behavior:'smooth'});
}

function updateTotal(){
    const qty = parseInt(document.getElementById('quantity').value);
    document.getElementById('totalAmount').value = currentPrice * qty;
}

// Form submission with instant PDF ticket generation
document.getElementById('purchaseForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerText = "Generating Ticket...";

    const ticketNumber = generateTicketNumber(); // Generate ticket number

    const qty = parseInt(document.getElementById('quantity').value);
    const totalAmount = currentPrice * qty;

    const formData = {
        ticketType: currentTicket,
        ticketNumber: ticketNumber,
        unitPrice: currentPrice,
        quantity: qty,
        totalAmount: totalAmount,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        paymentReference: document.getElementById('paymentReference').value,
        accountName: document.getElementById('accountNameUser').value,
        paymentDate: document.getElementById('paymentDate').value
    };

    try {
        // Send data to Google Sheet
        await fetch("https://script.google.com/macros/s/AKfycbxaSxX1Y3OWiKlqo2X4d6O64-sM7pzbWbKNPx5VGlQcsJJ04sSuC3wfBX-BBKf6q4Yx/exec", {
            method:"POST",
            body: JSON.stringify(formData)
        });

        // Generate PDF ticket
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.text("Exclusive Fashion Event", 105, 20, { align: "center" });

        doc.setFontSize(14);
        doc.text(`Ticket Number: ${ticketNumber}`, 20, 40);
        doc.text(`Name: ${formData.fullName}`, 20, 50);
        doc.text(`Ticket Type: ${formData.ticketType}`, 20, 60);
        doc.text(`Quantity: ${formData.quantity}`, 20, 70);
        doc.text(`Total Paid: ₦${formData.totalAmount}`, 20, 80);
        doc.text(`Payment Ref: ${formData.paymentReference}`, 20, 90);
        doc.text(`Payment Date: ${formData.paymentDate}`, 20, 100);
        doc.text("Please present this ticket at the entrance.", 20, 120);

        // Automatically open print dialog
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');

        document.getElementById('purchaseForm').reset();
        showSuccess();

        btn.disabled = false;
        btn.innerText = "Submit Confirmation";
    } catch(err){
        alert("Error generating ticket. Try again.");
        btn.disabled = false;
        btn.innerText = "Submit Confirmation";
    }
});

// Success modal
function showSuccess(){
    document.getElementById('overlay').classList.add('active');
    document.getElementById('successModal').classList.add('active');
}

function closeModal(){
    document.getElementById('overlay').classList.remove('active');
    document.getElementById('successModal').classList.remove('active');
}