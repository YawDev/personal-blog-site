export const saveToLocalStorage = (key: string, value: any) => {
  if (typeof window === "undefined") return; // Server safety
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key: string) => {
  console.log(`Attempting to retrieve key "${key}" from localStorage...`);
  console.log(
    "localStorage available:",
    typeof window !== "undefined" && window.localStorage,
  );
  if (typeof window === "undefined") return null; // Server safety

  const result = localStorage.getItem(key);

  return result ? JSON.parse(result) : null;
};
