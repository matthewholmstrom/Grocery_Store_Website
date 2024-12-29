--Section : Select statements to display the table representing each entity
-- get all customers for the browse customers page
SELECT Customers.customerID, name, email, phone, address 
     FROM Customers;
          


-- get all products for the browse products page
SELECT Products.productID, productName, price, quantityInStock, quantitySold, productCategory, Products.brandID
     FROM Products
     inner join ProductBrands
     on Products.brandID = ProductBrands.brandID;


-- get all product brands for the browse product brands page
SELECT ProductBrands.brandID, brandName, brandCountry
     FROM ProductBrands;
          


-- get all orders for the browse orders page
SELECT Orders.orderID, Orders.customerID, Orders.locationID, saleDate, totalPrice
     FROM Orders
     inner join Customers
     on Orders.customerID = Customers.customerID
     inner join StoreLocations
     on Orders.locationID = StoreLocations.locationID;



-- get all store locations for the browse store locations page
SELECT StoreLocations.locationID, locationName, address, phone, openHours
     FROM StoreLocations;



-- get all order has products for the browse store OrderHasProducts page
SELECT OrderHasProducts.orderID, OrderHasProducts.productID
     FROM OrderHasProducts
     inner join Orders on OrderHasProducts.orderID = Orders.orderID
     inner join Products on OrderHasProducts.productID = Products.productID;
     

--Section : adding new items to each of the tables (required)

-- adding a new customer
INSERT INTO Customers (customerID, name, email, phone, address) VALUES (:customerID_from_dropdown, :name, :email, :phone, :address);

-- adding a new product
select brandID from ProductBrands;

INSERT INTO Products (productID, productName, price, quantityInStock, quantitySold, productCategory, brandID) 
VALUES (:productID, :name, :email, :phone, :address, :brandID_dropdown);


-- adding a new product brand
 INSERT INTO ProductBrands (brandID, brandName, brandCountry) VALUES (:brandID, :brandName, :brandCountry);


-- adding a new store location
 INSERT INTO StoreLocations (locationID, locationName, address, phone, openHours) VALUES (:locationID, :locationName, :address, :phone, :openHours);


-- populating the drop down menus for the location and  IDs.
select customerID from Customers;

select locationID from StoreLocations;


-- adding a new order 
INSERT INTO Orders (orderID, customerID, locationID, saleDate, totalPrice )
VALUES (:orderID_from_dropdown_input, :customerID_from_dropdown_input, :locationId_drop_down, :saleDate, :totalPrice);



-- populating the drop down menus for the order and product IDs.
select orderID from Orders;

select productID from Products;


-- adding a new order has products
INSERT INTO OrderHasProducts (orderID, productID) VALUES (:orderID_from_dropdown_input, :productID_from_dropdown_input);



--Delete Section 


-- delete a customer 
DELETE FROM Customers WHERE customerID = :customerID_selected_from_delete_button;


-- delete a product 
DELETE FROM Products WHERE productID = :productID_selected_from_the_delete_button;


-- delete a product brand 
DELETE FROM ProductBrands WHERE brandID = :brandID_selected_from_the_delete_button;


-- delete an order 
DELETE FROM Orders WHERE orderID = :orderID_selected_from_delete_button;


-- delete a store location 
DELETE FROM StoreLocations WHERE locationID = :locationID_selected_from_the_delete_button;

-- delete an OrderHasProducts 
DELETE FROM OrderHasProducts WHERE orderID = :order_ID_selected_from_the_dropdown
and productID = :product_ID_selected_from_the_dropdown;



-- UPDATE SECTION  

-- update a customer's data 
SELECT customerID, name, email, phone, address 
   FROM customerID
   WHERE customerID = :customerID_from_browse_Customers_page;


UPDATE Customers 
   SET name = :name, email = :email, 
       phone = :phone, address =:address;
    WHERE customerID = :customerID_from_the_update_form;

 
-- update a products data 

SELECT Products.productID, productName, price, quantityInStock, quantitySold, productCategory, Products.brandID
     FROM Products
     where productID = :productID_selected_from_the_edit_button;


UPDATE Products
   SET  productName= :ProductName, quantityInStock = :quantityInStock,  productCategory = :productCategory,
   brandID= :Product.brandID_dropdown;
   where productID = :productID_selected_from_the_edit_form;




--update a product brands data

SELECT ProductBrands.brandID, brandName, brandCountry
     FROM ProductBrands
     where brandID = :brandID_selected_from_the_edit_button;


UPDATE ProductBrands
   SET brandName= :brandName, brandCountry = :brandCountry
   where brandID = :brandID_selected_from_the_edit_form;



-- update an order's data 

SELECT Orders.orderID, Orders.customerID, Orders.locationID, saleDate, totalPrice
     FROM Orders
     where orderID = :orderID_selected_from_the_edit_button;

UPDATE Orders
   SET  customerID = :Orders.customerID_drop_down, locationID = :Orders.locationId_drop_down, saleDate = :saleDate,
   totalPrice = :totalPrice
   where orderID = :orderID_selected_from_the_edit_button;
   


--update a StoreLocations data

SELECT StoreLocations.locationID, locationName, address, phone, openHours
     FROM StoreLocations
     where locationID = :orderID_selected_from_the_edit_button;


UPDATE StoreLocations
   SET locationName= :locationName, address = :address,  phone = :phone,
   openHours = :openHours
   where locationID = :orderID_selected_from_the_edit_form;



-- update an OrderHasProducts data 

SELECT
 OrderHasProducts.orderID, OrderHasProducts.productID
     FROM OrderHasProducts
     where orderID = :orderID_selected_from_the_edit_button AND productID = :productID_selected_from_the_edit_button;

UPDATE OrderHasProducts
   SET orderID = :OrderHasProducts.orderID, productID = :OrderHasProducts.productID
   where orderID = :orderID_selected_from_the_edit_form AND productID = :productID_selected_from_the_edit_form;