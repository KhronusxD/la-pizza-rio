export interface PriceOption {
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  prices: PriceOption[];
  category: string;
  image?: string;
}

const SHEET_ID = "16dMWzCmXcKXN1cLVaSRqPOTza4Fy3cgLpY8lYHnhtjw";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

function parseCSV(raw: string): string[][] {
  const rows: string[][] = [];
  let inQuote = false;
  let field = "";
  let row: string[] = [];

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    const next = raw[i + 1];

    if (ch === '"') {
      if (inQuote && next === '"') {
        field += '"';
        i++;
      } else {
        inQuote = !inQuote;
      }
    } else if (ch === "," && !inQuote) {
      row.push(field.trim());
      field = "";
    } else if ((ch === "\r" || ch === "\n") && !inQuote) {
      if (ch === "\r" && next === "\n") i++;
      row.push(field.trim());
      if (row.some((f) => f !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field || row.length) {
    row.push(field.trim());
    if (row.some((f) => f !== "")) rows.push(row);
  }
  return rows;
}

export async function fetchMenuFromSheets(): Promise<Product[]> {
  const response = await fetch(CSV_URL);
  if (!response.ok) throw new Error("Falha ao carregar o cardápio.");
  const text = await response.text();

  const rows = parseCSV(text);
  if (rows.length < 2) return [];

  // Header: Categoria, Nome do Item, Descrição, Preço (R$), Preço G 8 Fatias, Preço GG 12 Fatias, Copo 340 ml, Jarra 1L
  const products: Product[] = [];
  let counter = 0;

  for (let i = 1; i < rows.length; i++) {
    const [categoria, nome, descricao, precoFixo, precoG, precoGG, precoCopo, precoJarra] = rows[i];

    if (!categoria || !nome) continue;

    const prices: PriceOption[] = [];

    if (precoG && parseFloat(precoG) > 0) {
      prices.push({ label: "G (8 Fatias)", price: parseFloat(precoG) });
    }
    if (precoGG && parseFloat(precoGG) > 0) {
      prices.push({ label: "GG (12 Fatias)", price: parseFloat(precoGG) });
    }
    if (precoCopo && parseFloat(precoCopo) > 0) {
      prices.push({ label: "Copo 340ml", price: parseFloat(precoCopo) });
    }
    if (precoJarra && parseFloat(precoJarra) > 0) {
      prices.push({ label: "Jarra 1L", price: parseFloat(precoJarra) });
    }
    if (precoFixo && parseFloat(precoFixo) > 0 && prices.length === 0) {
      prices.push({ label: "Unidade", price: parseFloat(precoFixo) });
    }

    if (prices.length === 0) continue;

    counter++;
    products.push({
      id: `p${counter}`,
      name: nome,
      description: descricao === "-" ? "" : descricao,
      prices,
      category: categoria,
    });
  }

  return products;
}
