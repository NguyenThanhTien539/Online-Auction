








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


update products
set end_time = now() + interval '5 minutes'
where product_id = 8;

select * from products where product_id = 8
