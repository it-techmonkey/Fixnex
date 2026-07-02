async function fetchError() {
  const res = await fetch("http://localhost:3000/api/test-email");
  const text = await res.text();
  console.log(text);
}
fetchError();
