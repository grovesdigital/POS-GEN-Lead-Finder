// Real HTTP client using fetch
export async function postJSON(url, payload, headers = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  return {
    status: res.status,
    data: text,
    url,
    payload,
  };
}
