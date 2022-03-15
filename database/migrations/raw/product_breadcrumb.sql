CREATE VIEW `product_breadcrumbs` AS
WITH RECURSIVE `prodcats`
AS (
    SELECT 0 as `level`, `c`.`id` as `start_id`, `c`.`id`, `c`.`name`, `c`.`category_id` from `categories` as `c`
    UNION ALL
    (
		SELECT `pc`.`level` + 1 as `level`, `pc`.`start_id`, `c`.`id`, `c`.`name`, `c`.`category_id` FROM `categories` as `c`
        JOIN `prodcats` as `pc` on `pc`.`category_id` = `c`.`id`
    )
)
SELECT
    `p`.`id` as `product_id`, `pc`.`name`, `pc`.`level`, `pc`.`id` as `category_id`
FROM
    `products` as `p`
LEFT JOIN
	`prodcats` as `pc`
ON `pc`.`start_id` = `p`.`category_id`;
