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
         JOIN `catrec` ON (`catrec`.`id` = `t`.`category_id`))),
               `recprod` AS
  (SELECT `catrec`.`start_id` AS `start_id`,
          `catrec`.`id` AS `cat_id`,
          `p`.`id` AS `product_id`,
          `p`.`stock` AS `product_stock`
   FROM (`catrec`
         JOIN (
            SELECT ifnull(`i`.`in_stock`, 1) as `stock`, `p`.*
            FROM (`products` as `p`)
            LEFT JOIN `product_ingredients` as `pi` ON `pi`.`product_id` = `p`.`id` AND `pi`.`required` = 1
            LEFT JOIN `ingredients` as `i` ON `pi`.`ingredient_id` = `i`.`id`
            GROUP BY `p`.`id`
         ) AS `p` ON ((`catrec`.`id` = `p`.`category_id`)))),
               `catprod` AS
  (SELECT `t`.`id` AS `id`,
          `t`.`name` AS `name`,
          `t`.`priority` AS `priority`,
          `t`.`category_id` AS `category_id`,
          sum(`r`.`product_stock`) > 0 AS `stock`,
          count(0) AS `descendant_count`
   FROM (`categories` `t`
         LEFT JOIN `recprod` `r` ON ((`t`.`id` = `r`.`start_id`)))
   WHERE (`r`.`product_id` IS NOT NULL)
   GROUP BY `t`.`id`
   ORDER BY `t`.`priority`)
SELECT `categories`.`id` AS `id`,
       `categories`.`name` AS `name`,
       `categories`.`priority` AS `priority`,
       `categories`.`hide_if_unavailable` AS `hide_if_unavailable`,
       `categories`.`category_id` AS `category_id`,
       ifnull(`catprod`.`descendant_count`, 0) AS `descendant_count`,
       `catprod`.`stock` AS `in_stock`
FROM (`categories`
      LEFT JOIN `catprod` ON ((`catprod`.`id` = `categories`.`id`)))
