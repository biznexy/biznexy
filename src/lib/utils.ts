import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

const getInputValue = (id: string) => {
  const inputElement = document.getElementById(id) as HTMLInputElement;
  return inputElement ? inputElement.value : '';
}

const clearInput = (id: string) => {
  const inputElement = document.getElementById(id) as HTMLInputElement;
  if (inputElement) {
    inputElement.value = '';
  }
}

const postRequest = async (url: string, appCheckToken: string, data: any = {}): Promise<Response> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Firebase-AppCheck": appCheckToken
  };

  return await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
    credentials: 'include',
  });
}

export { cn, getInputValue, clearInput, postRequest }
