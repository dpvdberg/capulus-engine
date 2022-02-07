CREATE VIEW `category_descendants` AS
WITH RECURSIVE `catrec` AS
  (SELECT `t`.`id` AS `start_id`,
          `t`.`id` AS `id`,
          `t`.`name` AS `name`,
          `t`.`priority` AS `priority`,
          `t`.`category_id` AS `category_id`,
          1 AS `lvl`
   FROM `categories` `t`
   UNION ALL SELECT `catrec`.`start_id` AS `start_id`,
                    `t`.`id` AS `id`,
                    `t`.`name` AS `name`,
                    `t`.`priority` AS `priority`,
                    `t`.`category_id` AS `category_id`,
                    (`catrec`.`lvl` + 1) AS `lvl`
   FROM (`categories` `t`
         JOIN `catrec` ON ((`catrec`.`id` = `t`.`category_id`)))),
               `recprod` AS
  (SELECT `catrec`.`start_id` AS `start_id`,
          `catrec`.`id` AS `cat_id`,
          `p`.`id` AS `product_id`
   FROM (`catrec`
         JOIN `products` `p` ON ((`catrec`.`id` = `p`.`category_id`)))),
               `catprod` AS
  (SELECT `t`.`id` AS `id`,
          `t`.`name` AS `name`,
          `t`.`priority` AS `priority`,
          `t`.`category_id` AS `category_id`,
          count(0) AS `descendant_count`
   FROM (`categories` `t`
         LEFT JOIN `recprod` `r` ON ((`t`.`id` = `r`.`start_id`)))
   WHERE (`r`.`product_id` IS NOT NULL)
   GROUP BY `t`.`id`
   ORDER BY `t`.`priority`)
SELECT `categories`.`id` AS `id`,
       `categories`.`name` AS `name`,
       `categories`.`priority` AS `priority`,
       `categories`.`category_id` AS `category_id`,
       ifnull(`catprod`.`descendant_count`, 0) AS `descendant_count`
FROM (`categories`
      LEFT JOIN `catprod` ON ((`catprod`.`id` = `categories`.`id`)))
