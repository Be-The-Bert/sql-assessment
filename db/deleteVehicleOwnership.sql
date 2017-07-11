update vehicles
set owner_id = null
where owner_id = $1
and id = $2
returning *;