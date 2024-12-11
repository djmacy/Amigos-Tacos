-- Drop existing tables if they exist
DROP TABLE IF EXISTS carne_tacos, loko_tacos, orders, quesabirrias, customer;

-- Create orders table
CREATE TABLE orders (
    id              INTEGER NOT NULL AUTO_INCREMENT,
    is_delivery     VARCHAR(3) NOT NULL,
    is_ready        VARCHAR(3) NOT NULL,
    has_salsa_verde VARCHAR(3) NOT NULL,
    has_salsa_rojo  VARCHAR(3) NOT NULL,
    mexican_cokes   INTEGER NOT NULL DEFAULT 0,
    waters          INTEGER NOT NULL DEFAULT 0, 
    total_price     DECIMAL(10, 2) NOT NULL,
    time_ordered    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Create items table
CREATE TABLE items (
    id   INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL,
    PRIMARY KEY (id)
);

-- Create toppings table
CREATE TABLE toppings (
    id            INTEGER NOT NULL AUTO_INCREMENT,
    has_cilantro  VARCHAR(3) NOT NULL,
    has_onion     VARCHAR(3) NOT NULL,
    meat          VARCHAR(10) NOT NULL,
    PRIMARY KEY (id)
);

-- Create order_items table
CREATE TABLE order_items (
    id         INTEGER NOT NULL AUTO_INCREMENT,
    order_id   INTEGER NOT NULL,
    item_id    INTEGER NOT NULL,
    topping_id INTEGER NOT NULL,
    quantity   INTEGER NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT order_items_order_fk FOREIGN KEY (order_id)
        REFERENCES orders (id),
    CONSTRAINT order_items_item_fk FOREIGN KEY (item_id)
        REFERENCES items (id),
    CONSTRAINT order_items_topping_fk FOREIGN KEY (topping_id)
        REFERENCES toppings (id)
);

-- Create kitchen_staff table
CREATE TABLE kitchen_staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create customer table
CREATE TABLE customer (
    id       INTEGER NOT NULL AUTO_INCREMENT,
    name     VARCHAR(255) NOT NULL,
    phone    VARCHAR(15) NOT NULL,
    email    VARCHAR(255) NOT NULL,
    address  VARCHAR(255),
    city     VARCHAR(100),
    PRIMARY KEY (id)
);

-- Modify the orders table to include the customer_id column
ALTER TABLE orders
ADD COLUMN customer_id INTEGER,
ADD CONSTRAINT orders_customer_fk FOREIGN KEY (customer_id)
    REFERENCES customer (id);
