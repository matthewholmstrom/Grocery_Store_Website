-- Team 20 Members: Matthew Holmstrom and Diego Diaz-Diaz 

-- Disable foreign key checks --------------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- Drop existing tables if they exist -------------------------------------------------------------
DROP TABLE IF EXISTS orderHasProducts, Orders, Products, Customers, StoreLocations, ProductBrands;

-- Create new tables ------------------------------------------------------------------------------

-- Table for Customers. The customerID is a primary key that is auto incremented
-- Represents a customer purchasing products at one of our grocery stores
CREATE TABLE Customers (
    customerID INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    address VARCHAR(200),
    PRIMARY KEY (customerID)
);

-- Table for ProductBrands. The brandID is a primary key that is auto incremented
-- Represents the different brands that could be purchased by a customer at our store
CREATE TABLE ProductBrands (
    brandID INT NOT NULL AUTO_INCREMENT, -- Primary key
    brandName VARCHAR(100) NOT NULL,
    brandCountry VARCHAR(100), -- Country where the brand is from
    PRIMARY KEY (brandID)
);

-- Table for StoreLocations. The locationID is a foreign key that references the locationID in the StoreLocations table
-- Represents the different individual locations of our store that customers can order from
CREATE TABLE StoreLocations (
    locationID INT NOT NULL AUTO_INCREMENT, -- Primary key
    locationName VARCHAR(100) NOT NULL, -- Name of the store location
    address VARCHAR(200) NOT NULL, -- Address of the store location
    phone VARCHAR(15), -- Phone number of the store location
    openHours VARCHAR(50), -- Hours of operation of the store location
    PRIMARY KEY (locationID) 
);

-- Table for Products. The brandID is a foreign key that references the brandID in the ProductBrands table
-- Represents one of the products that we are selling at one of our stores
CREATE TABLE Products (
    productID INT NOT NULL AUTO_INCREMENT, -- Primary key
    productName VARCHAR(100) NOT NULL, -- Name of the product
    price DECIMAL(10,2) NOT NULL, -- Price of the product
    quantityInStock INT NOT NULL, -- Quantity of the product in stock
    quantitySold INT NOT NULL, -- Quantity of the product sold
    productCategory VARCHAR(50) NOT NULL, -- Category of the product
    brandID INT NOT NULL, -- Foreign key that references the brandID in the ProductBrands table
    PRIMARY KEY (productID), 
    FOREIGN KEY (brandID) REFERENCES ProductBrands(brandID) ON DELETE CASCADE
);

-- Table for Orders. The customerID and locationID are foreign keys that reference the customerID and locationID in the Customers and StoreLocations tables
-- Represents an order being made at one of our stores that could consist of different products
CREATE TABLE Orders (
    orderID INT NOT NULL AUTO_INCREMENT, -- Primary key
    customerID INT NOT NULL, -- Foreign key that references the customerID in the Customers table
    locationID INT NOT NULL, -- Foreign key that references the locationID in the StoreLocations table
    saleDate DATETIME NOT NULL, -- Date of the sale
    totalPrice DECIMAL(10,2) NOT NULL, -- Total price of the order
    PRIMARY KEY (orderID), 
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE CASCADE, -- ON DELETE CASCADE helps to delete the order when the customer is deleted
    FOREIGN KEY (locationID) REFERENCES StoreLocations(locationID) ON DELETE CASCADE
);

-- Junction table for orderHasProducts. The orderID and productID are foreign keys that reference the orderID and productID in the Orders and Products tables
-- Junction Table that facilitates the relationship between Orders and Products
CREATE TABLE orderHasProducts (
    orderID INT NOT NULL, -- Foreign key that references the orderID in the Orders table
    productID INT NOT NULL, -- Foreign key that references the productID in the Products table
    PRIMARY KEY (orderID, productID), -- Composite primary key
    FOREIGN KEY (orderID) REFERENCES Orders(orderID) ON DELETE CASCADE, -- ON DELETE CASCADE helps to delete the orderHasProducts when the order is deleted 
    FOREIGN KEY (productID) REFERENCES Products(productID) ON DELETE CASCADE
);

-- Sample Data Insertion --------------------------------------------------------------------------

-- Customers
INSERT INTO Customers (name, email, phone, address) VALUES
('John Smith', 'jSmith@abc.com', '280-344-5555', '1673 Arden Way, 95661. Roseville, California'),
('Jill Nguyen', 'jNugyen@123.com', '892-444-1717', '1999 Oakville Street, 87543. Manhattan, New York'),
('Xavier Adams', 'xAdams@orange.com', '817-323-1616', '7231 Deloitte Way, 3443. Topeka, Kansas'),
('Miguel Prakash', 'mPrakash@123.com', '625-832-9934', '6728 Green Meadows Court, Franklin, Maine');

-- ProductBrands
INSERT INTO ProductBrands (brandName, brandCountry) VALUES
('Greens for less', 'United States'),
('Four Square','China'),
('Columbia soul', 'Colombia'),
('Aardvark', 'Spain');

-- StoreLocations
INSERT INTO StoreLocations (locationName, address, phone, openHours) VALUES
('Bloomsfield Plaza', '1444 Howe Ave, 84522. Albany, Oregon', '916-441-0071', '7 days of the week, from 8am to 10pm'),
('Sparrow Corner', '1009 Douglas Blvd, 84503. Monroe, Oregon', '916-511-8886', 'Mon-Sat, from 8am to 10pm'),
('The Galleria', '1999  Tupelo Rd, 84601. Philomath, Oregon', '916-865-3364', '7 days of the week, from 8am to 10pm'),
('The Commons', '1001 El Camino Ave, 84549. Adair Village, Oregon', '916-718-9876', 'Mon-Sat, from 8am to 12pm');

-- Products
INSERT INTO Products (productName, price, quantityInStock, quantitySold, productCategory, brandID) VALUES
('broccoli bunch', 4.99, 55, 195, 'produce' , 1),
('notebook and pencils pack', 3.95, 8, 837,'stationary', 2),
('frozen salmon', 8.99, 20, 101 , 'frozen items', 3),
('backpack', 13.99, 3, 200 , 'stationary', 4);

-- Orders
INSERT INTO Orders (customerID, locationID, saleDate, totalPrice) VALUES
(1, 2, '2022-10-01', 101.93),
(2, 3, '2024-08-30', 52.07),
(3, 1, '2024-01-15', 200.01),
(4, 4, '2023-12-25', 78.42);

-- orderHasProducts
INSERT INTO orderHasProducts (orderID, productID) VALUES
(4, 1),
(2, 3),
(3, 2),
(1, 4); 

-- Enable foreign key checks again ----------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;