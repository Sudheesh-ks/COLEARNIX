
async function testExecution() {
  console.log("Testing Piston API connection...");
  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "javascript",
        version: "18.15.0",
        files: [{ content: 'console.log("Hello from Test")' }]
      })
    });
    
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Data:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Test Error:", err.message);
  }
}

testExecution();
