/** Sends the browser to the CCAvenue payment page (a POST form, as CCAvenue requires). */
export function redirectToGateway(checkout: { encRequest: string; accessCode: string; actionUrl: string }) {
  const form = document.createElement("form");
  form.method = "post";
  form.action = checkout.actionUrl;
  for (const [name, value] of [
    ["encRequest", checkout.encRequest],
    ["access_code", checkout.accessCode],
  ]) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
