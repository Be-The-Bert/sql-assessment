update vehicles
set owner_id = $2
where id = $1
returning *;