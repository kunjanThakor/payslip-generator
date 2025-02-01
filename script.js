// script.js

// Include jsPDF and html2canvas library
function loadLibraries() {
    const jsPDFScript = document.createElement('script');
    jsPDFScript.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    document.head.appendChild(jsPDFScript);

    const html2canvasScript = document.createElement('script');
    html2canvasScript.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    document.head.appendChild(html2canvasScript);
}
loadLibraries();

function generatePayslip() {
    // const name = document.getElementById("employeeName").value || "";
    const houseKeepingDay = parseFloat(document.getElementById("houseKeepingDay").value) || 0;
    const houseKeepingNight = parseFloat(document.getElementById("houseKeepingNight").value) || 0;
    const supervisor = parseFloat(document.getElementById("supervisor").value) || 0;
    const serviceCharge = parseFloat(document.getElementById("serviceCharge").value) || 0;

    const totalEarnings = houseKeepingDay + houseKeepingNight + supervisor + serviceCharge;
    const totalInWords = numberToWords(totalEarnings);

    document.getElementById("payslipOutput").innerHTML = `
        <div id="payslipContent" class="payslip-container">
            <div class="header text-center">
                <h2>Rameshbhai Thakor</h2>
                <p></p>
                <hr>
            </div>
            <h4 class="text-center">Pay Slip</h4>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Earnings</th>
                        <th>Amount</th>
                        <th>Deductions</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>House Keeping - Day</td>
                        <td>${houseKeepingDay}</td>
                        <td>Provident Fund</td>
                        <td>0</td>
                    </tr>
                    <tr>
                        <td>House Keeping - Night</td>
                        <td>${houseKeepingNight}</td>
                        <td>Professional Tax</td>
                        <td>0</td>
                    </tr>
                    <tr>
                        <td>Supervisor</td>
                        <td>${supervisor}</td>
                        <td>Loan</td>
                        <td>0</td>
                    </tr>
                    <tr>
                        <td>Service Charge</td>
                        <td>${serviceCharge}</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td><strong>Total Earnings</strong></td>
                        <td><strong>${totalEarnings}</strong></td>
                        <td><strong>Total Deductions</strong></td>
                        <td><strong>0</strong></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td><strong>Net Pay</strong></td>
                        <td><strong>${totalEarnings}</strong></td>
                    </tr>
                </tbody>
            </table>
            <div class="total-section">
                <p>Total in number: <span class="number">${totalEarnings.toLocaleString()}</span></p>
                <p>Total in words:</p>
                <p class="words">${totalInWords}</p>
            </div>
            <div class="footer text-center">
                <hr>
                <p>This is a system-generated payslip</p>
            </div>
            <button id="savePdfBtn" class="btn btn-success mt-3" onclick="saveAsPDF()">Save as PDF</button>
        </div>
    `;
}

function saveAsPDF() {
    // const payslip = document.getElementById("payslipContent");
    // const saveBtn = document.getElementById("savePdfBtn");
    // saveBtn.style.display = "none"; // Hide button before saving PDF

    // html2canvas(payslip, { scale: 3 }).then(canvas => { // Increase scale for better quality
    //     const imgData = canvas.toDataURL("image/png");
    //     const { jsPDF } = window.jspdf;
    //     const pdf = new jsPDF("p", "mm", "a4");
    //     const imgWidth = 190;
    //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //     pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    //     pdf.save("Payslip.pdf");
    //     saveBtn.style.display = "block"; // Show button again after saving PDF
    // });

    const payslip = document.getElementById("payslipContent");
    const saveBtn = document.getElementById("savePdfBtn");
    saveBtn.style.display = "none"; // Hide the button before saving the PDF

    // Check if the device is mobile and adjust the scale accordingly
    const isMobile = window.innerWidth <= 768; // Mobile screen detection (you can adjust this threshold)
    const scaleValue = isMobile ? 2 : 3; // Use a lower scale for mobile to avoid overflow

    // Use html2canvas to render the payslip content as an image
    html2canvas(payslip, { scale: scaleValue }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");

        // Create a jsPDF instance to generate the PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "mm", "a4");  // A4-sized PDF in portrait orientation

        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add the generated image to the PDF
        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

        // Save the PDF with the filename "Payslip.pdf"
        pdf.save("Payslip.pdf");

        saveBtn.style.display = "block"; // Show the save button again after the PDF is generated
    });

}


function numberToWords(num) {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + " " + ones[num % 10];
    if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred " + numberToWords(num % 100);
    if (num < 1000000) return numberToWords(Math.floor(num / 1000)) + " Thousand " + numberToWords(num % 1000);
    return "Number too large";
}

function forceDesktopMode() {
    // Create a new meta tag for viewport
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=1024';  // Force a fixed width to simulate desktop

    // Append the new meta tag to the head of the document
    document.head.appendChild(viewportMeta);

    // Optionally, you can also change the user-agent for fetch or AJAX requests, 
    // but this will not affect the display of the page itself.
}

// Call the function to apply desktop mode
forceDesktopMode();
