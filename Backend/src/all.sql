








--- FTS for products
alter table products
drop column if exists fts;

alter table
  products
add column
  fts tsvector generated always as (to_tsvector('english', remove_accents(product_name))) stored;

create index products_fts on products using gin (fts);


select * FROM products WHERE fts @@ to_tsquery('english', 'dien  thoai' );
