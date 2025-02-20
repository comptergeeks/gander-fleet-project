/*
connection command:
psql \
--host=gander-cluster.cnymcuo00or4.us-west-2.rds.amazonaws.com \
--port=5432 \
--username=postgres \
--password \
--dbname=

\ir to run file
*/
create table Aircrafts (
    plane_id varchar(10) PRIMARY KEY,
    status varchar(25),
    model varchar(25),
    tail_number varchar(10),
    curr_flight_hours int,
    capacity int,
    location varchar(25),
    maintenance_due_date timestamp
);

create table Trips (
    trip_id varchar(10) PRIMARY KEY,
    CRS_DEP timestamp,
    plane_id varchar(10),
    CRS_Arriv timestamp,
    trip_status varchar(10),
    origin varchar(25),
    destination varchar(25),
    is_current boolean default false,
    foreign key (plane_id) references Aircrafts (plane_id)
);
