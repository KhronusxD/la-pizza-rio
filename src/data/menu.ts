export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export const menuData: Product[] = [
  {
    id: "p1",
    name: "Pizza Calabresa",
    description: "Mussarela, calabresa fatiada e cebola.",
    price: 45.00,
    category: "Salgadas",
    image: "https://picsum.photos/seed/calabresa/400/300"
  },
  {
    id: "p2",
    name: "Pizza Margherita",
    description: "Mussarela, tomate em rodelas e manjericão fresco.",
    price: 42.00,
    category: "Salgadas",
    image: "https://picsum.photos/seed/margherita/400/300"
  },
  {
    id: "p3",
    name: "Pizza Quatro Queijos",
    description: "Mussarela, provolone, parmesão e gorgonzola.",
    price: 55.00,
    category: "Salgadas",
    image: "https://picsum.photos/seed/quatroqueijos/400/300"
  },
  {
    id: "d1",
    name: "Pizza Sensação",
    description: "Chocolate ao leite coberto com morangos fatiados.",
    price: 48.00,
    category: "Doces",
    image: "https://picsum.photos/seed/sensacao/400/300"
  },
  {
    id: "b1",
    name: "Guaraná Antarctica 2L",
    description: "Refrigerante gelado.",
    price: 12.00,
    category: "Bebidas",
    image: "https://picsum.photos/seed/guarana/400/300"
  },
  {
    id: "b2",
    name: "Coca-Cola 2L",
    description: "Refrigerante gelado.",
    price: 14.00,
    category: "Bebidas",
    image: "https://picsum.photos/seed/cocacola/400/300"
  }
];
