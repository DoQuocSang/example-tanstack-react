/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = "https://dummyjson.com";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Unknown API error");
  }
  return await response.json();
}

export async function apiGet<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal,
  });
  return handleResponse<T>(response);
}

export async function apiPost<T>(url: string, data: any): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

export async function apiPut<T>(url: string, data: any): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

export async function apiDelete<T>(url: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<T>(response);
}
