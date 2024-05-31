import  { useState } from 'react';

// eslint-disable-next-line react/prop-types
function Category({ setSelectedCategory, setSelectedType }) {
  const [isOpen, setIsOpen] = useState({
    all: false,
    veg: false,
    nonVeg: false,
    fruits:false,
  });

  const allItems = ['All', 'Breakfast', 'Lunch', 'Dinner'];
  const vegItems = ['All', 'Breakfast', 'Lunch', 'Dinner'];
  const nonVegItems = ['All', 'Breakfast', 'Lunch', 'Dinner'];
  const fruits = ['All', 'Breakfast', 'Lunch', 'Dinner'];

  const handleToggle = (category) => {
    setIsOpen((prevState) => ({
      all: false,
      veg: false,
      nonVeg: false,
      [category]: !prevState[category],
    }));
    setSelectedCategory(category);
    setSelectedType('all'); // Reset the type filter when a new category is selected
  };

  const handleTypeToggle = (type) => {
    setSelectedType(type);
  };

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
              <p
                key={index}
                onClick={() => handleTypeToggle(item.toLowerCase())}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                {item}
              </p>
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
        <Dropdown label="Non Veg" items={nonVegItems} category="nonVeg" />
        <Dropdown label="Fruits" items={fruits} category="fruits" />
      </div>
    </div>
  );
}

export default Category;
