

const BRIDGE_URL = "https://lspgf.com/api/db_bridge.php";
const BRIDGE_SECRET = "348Tj1lCr906!slw";

async function testBridge() {
  console.log("🚀 Testing PHP Bridge Connection...");
  
  try {
    const res = await fetch(BRIDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "get_posts_full", 
        secret: BRIDGE_SECRET, 
        limit: 1 
      })
    });

    const text = await res.text();
    console.log(`📡 Status: ${res.status}`);
    
    try {
      const data = JSON.parse(text);
      console.log("✅ Bridge Response:", JSON.stringify(data, null, 2));
    } catch (e) {
      console.log("❌ Failed to parse JSON. Raw output:");
      console.log(text);
    }
  } catch (err) {
    console.error("💥 Fetch Error:", err.message);
  }
}

testBridge();
