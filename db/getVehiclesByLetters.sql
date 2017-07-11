select v.id, make, model, year, owner_id from vehicles v
join users u on u.id = v.owner_id
where name like $1;