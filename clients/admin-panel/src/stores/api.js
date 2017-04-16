export default async function fetchJSON(method, data = {}) {
  const headers = new Headers();

  headers.append(`Content-Type`, `application/json`);
  headers.append(`Accept`, `application/json`);

  const res = await fetch(`/api/${method}`, {
    headers,
    method: `POST`,
    credentials: `include`,
    body: JSON.stringify(data)
  });
  const obj = await res.json();

  return obj;
}
