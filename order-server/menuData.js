function getMenuData() {
    const dishes = [
        { name: 'Cheese Sticks', price: 4.99, gst: 0.05 },
        { name: 'Chicken Wings', price: 7.99, gst: 0.1 },
        { name: 'Salad', price: 5.49, gst: 0.05 },
        { name: 'Mozzarella Sticks', price: 6.99, gst: 0.05 },
        { name: 'Onion Rings', price: 4.49, gst: 0.05 },
        { name: 'Garlic Bread', price: 3.99, gst: 0.05 },
        { name: 'Fried Calamari', price: 9.99, gst: 0.1 },
        { name: 'Potato Skins', price: 8.49, gst: 0.1 },
        { name: 'Buffalo Wings', price: 8.99, gst: 0.1 },
        { name: 'Bruschetta', price: 5.99, gst: 0.05 },
        { name: 'Nachos', price: 10.99, gst: 0.1 },
        { name: 'Quesadilla', price: 7.49, gst: 0.05 },
        { name: 'Spinach Dip', price: 6.49, gst: 0.05 },
        { name: 'Shrimp Cocktail', price: 12.99, gst: 0.1 },
        { name: 'Caprese Salad', price: 8.99, gst: 0.1 },
        { name: 'Wings', price: 8.99, gst: 0.1 },
    ];

    const soupsAndDesserts = [
        { name: 'Tomato Soup', price: 4.99, gst: 0.05 },
        { name: 'Chicken Noodle Soup', price: 5.99, gst: 0.05 },
        { name: 'Minestrone', price: 6.49, gst: 0.05 },
        { name: 'Clam Chowder', price: 7.49, gst: 0.1 },
        { name: 'French Onion Soup', price: 6.99, gst: 0.1 },
        { name: 'Chocolate Cake', price: 5.99, gst: 0.1 },
        { name: 'Cheesecake', price: 6.99, gst: 0.1 },
        { name: 'Ice Cream', price: 4.49, gst: 0.05 },
        { name: 'Apple Pie', price: 5.49, gst: 0.05 },
        { name: 'Brownie', price: 4.99, gst: 0.05 },
        { name: 'Sauce', price: 2.80, gst: 0.05 }, // New soup dish 1
        { name: 'Veggie Soup', price: 6.99, gst: 0.1 }, // New soup dish 2
    ];

    const drinks = [
        { name: 'Coca Cola', price: 1.99, gst: 0.05 },
        { name: 'Pepsi', price: 1.99, gst: 0.05 },
        { name: 'Lemonade', price: 2.49, gst: 0.1 },
        { name: 'Iced Tea', price: 2.49, gst: 0.1 },
        { name: 'Orange Juice', price: 3.49, gst: 0.1 },
        { name: 'Milkshake', price: 4.99, gst: 0.1 },
        { name: 'Smoothie', price: 5.49, gst: 0.1 },
        { name: 'Water', price: 0.99, gst: 0 },
        { name: 'Sparkling Water', price: 1.49, gst: 0 },
        { name: 'Coffee', price: 2.99, gst: 0.05 },
        { name: 'Tea', price: 2.89, gst: 0.05 },
        { name: 'Mojito', price: 2.55, gst: 0.1 },
        { name: 'Wings', price: 2.55, gst: 0.05 },
        { name: 'Wings dish', price: 2.55, gst: 0.08 },
    ];

    return {
        dishes,
        soupsAndDesserts,
        drinks,
    };
}

module.exports = getMenuData;
