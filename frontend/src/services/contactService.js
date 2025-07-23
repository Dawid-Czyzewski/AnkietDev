import { API_BASE } from '../config';

export async function sendContactForm({ name, email, message }) {
  const response = await fetch(`${API_BASE}/?controller=contact&action=send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, message }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Unknown error");
  }

  return response.json();
}
