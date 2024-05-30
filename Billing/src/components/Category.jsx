import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Category() {
  const [isOpen, setIsOpen] = useState({
    all: false,
    veg: false,
    nonVeg: false,
    fruits: false,
  });

  const allItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  const vegItems = ['Veg 1', 'Veg 2', 'Veg 3', 'Veg 4'];
  const nonVegItems = ['Non-Veg 1', 'Non-Veg 2', 'Non-Veg 3', 'Non-Veg 4'];
  const fruitItems = ['Fruit 1', 'Fruit 2', 'Fruit 3'];

  const handleToggle = (category) => {
    setIsOpen((prevState) => ({
      all: false,
      veg: false,
      nonVeg: false,
      fruits: false,
      [category]: !prevState[category],
    }));
  };

  // eslint-disable-next-line react/prop-types
  const Dropdown = ({ label, items, category }) => (
    <div className="relative inline-block text-left">
      <button
        onClick={() => handleToggle(category)}
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
      >
        {label}
      </button>

      {isOpen[category] && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {items.map((item, index) => (
              <Link
                key={index}
                to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-center">
      <div className="flex space-x-4 p-4">
        <Dropdown label="All" items={allItems} category="all" />
        <Dropdown label="Veg" items={vegItems} category="veg" />
        <Dropdown label="Non-Veg" items={nonVegItems} category="nonVeg" />
        <Dropdown label="Fruits" items={fruitItems} category="fruits" />
      </div>
    </div>
  );
}

export default Category;
