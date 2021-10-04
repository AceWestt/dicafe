import React, { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { GoBook } from "react-icons/go";
import { GoOrganization } from "react-icons/go";
import { GoOctoface } from "react-icons/go";
import { GoChecklist } from "react-icons/go";
import { GoBrowser } from "react-icons/go";
import { GoGlobe } from "react-icons/go";
import { BiCoffeeTogo } from "react-icons/bi";
import { FaFolder } from "react-icons/fa";
import { useAdminContext } from "../context";

const SideBarMenu = () => {
  const match = useRouteMatch();
  const { setScreenTitle } = useAdminContext();
  const [activeItem, setActiveItem] = useState(1);

  useEffect(() => {
    const changeactivescreen = () => {
      const currentPath = window.location.pathname;
      const activescreenname = currentPath.split("/")[2];
      menuitems.map((item) => {
        if (activescreenname === item.url) {
          setActiveItem(item.id);
          setScreenTitle(item.title);
        }
        return item;
      });
    };

    changeactivescreen();
    window.onpopstate = () => {
      changeactivescreen();
    };
  }, [setScreenTitle]);

  return (
    <div className="menu">
      {menuitems.map((item, index) => {
        const Icon = item.icn;
        if (item.type !== "label") {
          return (
            <Link
              className={`item ${item.class ? item.class : ""} ${
                item.id === activeItem ? "active" : ""
              }`}
              key={`menu-item_${index}`}
              to={`${match.path}/${item.url}`}
              onClick={() => {
                setScreenTitle(item.title);
                setActiveItem(item.id);
              }}
            >
              <Icon className="icon" />
              <span>{item.title}</span>
            </Link>
          );
        }
        return (
          <div className="item label" key={`menu-item_${index}`}>
            <Icon className="icon" />
            <span>{item.title}</span>
          </div>
        );
      })}
    </div>
  );
};

export default SideBarMenu;

export const menuitems = [
  { id: 0, title: "Контент", type: "label", icn: GoBrowser },
  { id: 1, title: "Начальный экран", url: "", class: "main", icn: GoHome },
  {
    id: 2,
    title: "Экран «о нас»",
    url: "about",
    class: "about",
    icn: GoBook,
  },
  {
    id: 3,
    title: "Экран «контакты»",
    url: "contact",
    class: "contact",
    icn: GoOrganization,
  },
  {
    id: 4,
    title: "Экран «ваши дудлы»",
    url: "doodles",
    class: "doodles",
    icn: GoOctoface,
  },
  {
    id: 5,
    title: "Экран «заказать»",
    url: "order",
    class: "order",
    icn: GoChecklist,
  },
  {
    id: 6,
    title: "Общее",
    url: "general",
    class: "general",
    icn: GoGlobe,
  },
  { id: 0, title: "Продукция", type: "label", icn: BiCoffeeTogo },
  {
    id: 7,
    title: "Категории",
    url: "categories",
    class: "categories",
    icn: FaFolder,
  },
  {
    id: 8,
    title: "Продукты",
    url: "products",
    class: "products",
    icn: BiCoffeeTogo,
  },
];
