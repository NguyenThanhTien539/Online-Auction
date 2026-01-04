








--- FTS for products
alter table products
drop column if exists fts;

alter table
  products
add column
  fts tsvector generated always as (to_tsvector('english', remove_accents(product_name))) stored;

create index products_fts on products using gin (fts);


select * FROM products WHERE fts @@ to_tsquery('english', 'dien  thoai' );


 SELECT 
            p.*, u.username AS price_owner_username, count(*) OVER() AS total_count
            FROM products p
        LEFT JOIN users u ON p.price_owner_id = u.user_id
        WHERE p.cat2_id = 8 and p.is_removed = false
            and p.fts @@ websearch_to_tsquery('english', remove_accents(''))
        -- ORDER BY ${
        --   orderBy.length > 0 ? orderBy.join(", ") : "p.product_id DESC"
        -- }
        LIMIT 100 OFFSET 0


select p.* from products p 
left join users u on p.seller_id = u.user_id
where u.username = 'Siuu1412';


-------------- Check is selling products 
 select p.*, u.username as price_owner_username, count(*) over() as total_count
        from products p
        left join users u on p.price_owner_id = u.user_id
        where p.seller_id = ? and p.end_time > now()
        order by p.created_at desc


---------------- Check is sold products
select p.*, u.username as price_owner_username, count(*) over() as total_count
        from products p
        left join users u on p.price_owner_id = u.user_id
        where p.seller_id = 43 and p.end_time < now() and p.price_owner_id is not null
        order by p.created_at desc



---------------- Check is won products 
select p.*, u.username as price_owner_username, count(*) over() as total_count
        from products p
        left join users u on p.price_owner_id = u.user_id
        where p.price_owner_id = ? and p.end_time < now()
        order by p.created_at desc

      
 ------------------- Check is bidding products 

SELECT
            p.*,
            u.username AS price_owner_username, count(*) OVER() AS total_count
        FROM products p
        LEFT JOIN users u ON p.price_owner_id = u.user_id
        WHERE
            p.end_time > NOW()
            AND p.product_id IN (
                SELECT DISTINCT product_id
                FROM bidding_history
                WHERE user_id = ?
            )
        ORDER BY p.created_at DESC     

------------------------ Check inventory products



select p.*, u.username as price_owner_username, count(*) over() as total_count
        from products p
        left join users u on p.price_owner_id = u.user_id
        where p.seller_id = 43 and p.end_time < now() and p.price_owner_id is null
        order by p.created_at desc



delete from bidding_history where product_id = 54
delete from bidding_ban_user where product_id = 54
update products set price_owner_id = null where product_id = 54

update products set current_price = start_price where product_id = 54

select * from products where product_id = 54;