import cofee_1_img from "../imgs/choose/coffee_1.png";
import cofee_2_img from "../imgs/choose/coffee_2.png";
import cofee_3_img from "../imgs/choose/coffee_3.png";
import cofee_4_img from "../imgs/choose/coffee_4.png";

export const categories = [
  { id: 1, ru: "Кофе", en: "" },
  { id: 2, ru: "Милкшейки", en: "" },
  { id: 3, ru: "Коктейли", en: "" },
];

export const products = [
  {
    id: 1,
    category_id: 1,
    img: cofee_1_img,
    title: { ru: "Американо", en: "" },
    subtitle: { ru: "Лучший американо", en: "" },
    price: "15000",
  },
  {
    id: 2,
    category_id: 1,
    img: cofee_2_img,
    title: { ru: "Капучино", en: "" },
    subtitle: { ru: "Лучший капучино", en: "" },
    price: "18000",
  },
  {
    id: 3,
    category_id: 1,
    img: cofee_3_img,
    title: { ru: "Фрапе", en: "" },
    subtitle: { ru: "Лучший фрапе", en: "" },
    price: "23000 ",
  },
  {
    id: 4,
    category_id: 1,
    img: cofee_4_img,
    title: { ru: "Лате", en: "" },
    subtitle: { ru: "Лучший лате", en: "" },
    price: "14000",
  },
];
