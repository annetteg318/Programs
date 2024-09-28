const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Initialize QuaggaJS
Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#interactive'), // Attach to video element
        constraints: {
            facingMode: "environment" // Use the back camera
        }
    },
    decoder: {
        readers: ["ean_reader"] // Specify the type of barcode to scan
    }
}, function(err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log("QuaggaJS initialized.");
    Quagga.start();
});

// Process the result when a barcode is detected
Quagga.onDetected(function(result) {
    const code = result.codeResult.code;
    console.log("Detected barcode:", code);

    // Show the detected barcode
    document.getElementById('result').innerText = `Barcode detected: ${code}`;

    // Stop QuaggaJS scanning
    Quagga.stop();
    
    // Capture the current frame (screen grab)
    screenGrab();

    // Optionally: Call the API to get product details (same as before)
    // fetchProductDetails(code); // Reuse the same API call logic from the previous example
});

// Function to take a screenshot from the video feed
function screenGrab() {
    const videoElement = document.querySelector('#interactive video');

    // Set canvas size to match the video size
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Draw the current frame from the video onto the canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Get the image data URL from the canvas
    const imageDataURL = canvas.toDataURL('image/png');

    // Display the captured image
    const img = new Image();
    img.src = imageDataURL;
    document.body.appendChild(img);

    // Create and append a div with the recycling instructions
    const instructions = document.createElement('div');
    instructions.innerHTML = `
        <h2>Recycling Instructions</h2>
        <p><strong>1. Separate Materials</strong></p>
        <p>Remove Metal Spiral Binding: If your notebook has a metal spiral, carefully remove it. Metal can typically be recycled separately.</p>
        <p>Remove Plastic Covers: If the notebook has plastic covers, these should be removed and disposed of separately as they may not be recyclable in standard paper streams.</p>
        <p><strong>2. Paper Recycling</strong></p>
        <p>Recycle Paper Pages: Most notebook pages, especially if they are uncoated or lightly printed, can go into your regular paper recycling. Check for any coated or laminated pages, which might need special handling.</p>
        <p><strong>3. Repurpose Unused Pages</strong></p>
        <p>Reuse Pages: If the notebook has unused pages, consider tearing them out and using them for scratch paper, note-taking, or shopping lists before recycling the rest.</p>
    `;

    // Apply some basic styling to the instructions
    instructions.style.marginTop = "20px";
    instructions.style.padding = "10px";
    instructions.style.backgroundColor = "#f0f0f0";
    instructions.style.border = "1px solid #ccc";
    instructions.style.borderRadius = "8px";

    // Append the instructions to the document
    document.body.appendChild(instructions);
}
