select v.id, make, model, year, owner_id, name from vehicles v
join users u on u.id = v.owner_id
where year > 2000
order by year desc;