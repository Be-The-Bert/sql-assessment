delete from vehicles
where id = $1
returning *;