select * from products


--  Delete all records from products table
delete from products;

-- DELETE all records from categories table
delete from categories;

select * from categories;



--- Reset ID sequence for categories table
ALTER SEQUENCE public.categories_id_seq RESTART WITH 1;


--- Reset ID sequence for products table
ALTER SEQUENCE public.products_product_id_seq RESTART WITH 1;