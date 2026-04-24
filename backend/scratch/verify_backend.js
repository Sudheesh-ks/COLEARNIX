
async function verifyBackend() {
  console.log("Verifying backend with Judge0 integration (using native fetch)...");
  try {
    const response = await fetch("http://localhost:4000/api/room/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "javascript",
        version: "18.15.0",
        code: 'console.log("Success from Backend Integration Test")'
      })
    });
    
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response Body:", JSON.stringify(data, null, 2));
    
    if (data.success && data.data.run.stdout.includes("Success")) {
      console.log("✅ Verification Passed!");
    } else {
      console.log("❌ Verification Failed!");
    }
  } catch (err) {
    console.error("Verification Error:", err.message);
  }
}

verifyBackend();
