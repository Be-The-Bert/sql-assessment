insert into vehicles (make, model, year, owner_id) values ($1, $2, $3, $4)
returning *;