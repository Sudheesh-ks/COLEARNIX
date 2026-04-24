
async function testJudge0() {
  console.log("Testing Judge0 CE connection...");
  try {
    const response = await fetch("https://ce.judge0.com/submissions?wait=true", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: 'console.log("Hello from Judge0")',
        language_id: 63, // JavaScript (Node.js 12.14.0)
        stdin: ""
      })
    });
    
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Data:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Test Error:", err.message);
  }
}

testJudge0();
