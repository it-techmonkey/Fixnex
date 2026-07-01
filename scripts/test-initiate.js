// Node 22 native fetch

async function main() {
  try {
    const res = await fetch("http://localhost:3000/api/payment/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        custom_link_id: "cmr27penn0000kun87w5c20q7",
      }),
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
