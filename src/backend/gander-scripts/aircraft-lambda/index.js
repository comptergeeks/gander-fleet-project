// function to zip  zip -r function.zip index.js node_modules/ package.json

const { Client } = require("pg");
const fs = require("fs");

const dbConfig = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false,
  },
};

const getAircraftData = async (client) => {
  const query = `
    SELECT
      a.plane_id,
      a.status,
      a.model,
      a.tail_number,
      a.curr_flight_hours,
      a.maintenance_due_date,
      a.location,
      a.location_lat,
      a.locaton_long,
      t.trip_id,
      t.trip_status,
      t.origin,
      t.destination,
      t.crs_dep,
      t.crs_arriv
    FROM aircrafts a
    LEFT JOIN (
      SELECT DISTINCT ON (plane_id)
        plane_id,
        trip_id,
        trip_status,
        origin,
        destination,
        crs_dep,
        crs_arriv
      FROM trips
      WHERE is_current = true
      ORDER BY plane_id, crs_dep DESC
    ) t ON a.plane_id = t.plane_id
    ORDER BY a.plane_id;
  `;

  try {
    const result = await client.query(query);
    return result.rows;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }
};

//since it's a get function we can just pass in client
// feed this into claude with context of the table information
const getMapData = async (client) => {
  /* this function needs to handle a couple of operations:
    - first check the trips that are currently going on/and complete any updates
      - if their CRS Arrival has passed --> set the trip status to complete, set the plane status to available
          - set the planes current location to destination
          - set is current to false
          - check if their any other trips that are departing soon for this same plane and then update the trip id to the one that is most reccent to the current time
      - if the current time is  between crs_arrival and crs_dep for the current trip, set the status for the trip to active and the plane to in_air
      - if maintance date has passed --> set plane status to maintenance
    - for the part we want to return. I want to return first all the available planes "available" which should be array planes with following data:
    [
    {
      plane_id
      model:
      tail_number:
      location_lat
      location_long
    }
    ]
    next the planes that are in air array of json
    [
    {
    plane_id
    model:
    tail_number:
    origin_lat:
    origin_long:
    dest_lat:
    dest_long:
    }
    ]
  */
  const updateStatusQuery = `
      WITH updated_trips AS (
        UPDATE trips
        SET
          trip_status = CASE
            WHEN crs_arriv < NOW() THEN 'complete'
            WHEN NOW() BETWEEN crs_dep AND crs_arriv THEN 'active'
            ELSE trip_status
          END,
          is_current = CASE
            WHEN crs_arriv < NOW() THEN false
            ELSE is_current
          END
        WHERE is_current = true
        RETURNING plane_id, trip_status, destination, dest_lat, dest_long
      )
      UPDATE aircrafts a
      SET
        status = CASE
          WHEN maintenance_due_date < NOW() THEN 'maintenance'
          WHEN ut.trip_status = 'complete' THEN 'available'
          WHEN ut.trip_status = 'active' THEN 'in_air'
          ELSE a.status
        END,
        location = CASE
          WHEN ut.trip_status = 'complete' THEN ut.destination
          ELSE a.location
        END,
        location_lat = CASE
          WHEN ut.trip_status = 'complete' THEN ut.dest_lat
          ELSE a.location_lat
        END,
        locaton_long = CASE
          WHEN ut.trip_status = 'complete' THEN ut.dest_long
          ELSE a.locaton_long
        END
      FROM updated_trips ut
      WHERE a.plane_id = ut.plane_id;
    `;

  // Execute status updates
  await client.query(updateStatusQuery);

  // Query for available aircraft
  const availableQuery = `
      SELECT
        plane_id,
        model,
        tail_number,
        location_lat,
        locaton_long
      FROM aircrafts
      WHERE status = 'available'
      AND maintenance_due_date > NOW();
    `;

  // Query for in-air aircraft
  const inAirQuery = `
      SELECT
        a.plane_id,
        a.model,
        a.tail_number,
        t.origin_lat,
        t.origin_long,
        t.dest_lat,
        t.dest_long
      FROM aircrafts a
      JOIN trips t ON a.plane_id = t.plane_id
      WHERE a.status = 'in_air'
      AND t.is_current = true;
    `;

  try {
    const [availableResult, inAirResult] = await Promise.all([
      client.query(availableQuery),
      client.query(inAirQuery),
    ]);

    return {
      available: availableResult.rows,
      in_air: inAirResult.rows,
    };
  } catch (err) {
    console.error("Error fetching map data:", err);
    throw err;
  }
};
const createNewAircraft = async (client, aircraftData) => {
  console.log("creating new craft...");
  // Generate a new plane_id (AC + 3 digits)
  const getLastIdQuery = `
    SELECT plane_id
    FROM aircrafts
    WHERE plane_id LIKE 'AC%'
    ORDER BY plane_id DESC
    LIMIT 1;
  `;

  const lastId = await client.query(getLastIdQuery);
  let newId;
  if (lastId.rows.length === 0) {
    newId = "AC001";
  } else {
    const lastNum = parseInt(lastId.rows[0].plane_id.substring(2));
    newId = `AC${String(lastNum + 1).padStart(3, "0")}`;
  }

  console.log("lastId" + lastId);

  // Insert query with the new plane_id
  const query = `
    INSERT INTO aircrafts (
      plane_id,
      status,
      model,
      tail_number,
      curr_flight_hours,
      capacity,
      location,
      maintenance_due_date,
      location_lat,
      locaton_long
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;

  // Default current flight hours to 0 if not provided
  const curr_flight_hours = aircraftData.curr_flight_hours || 0;

  // coordinates will be determined by importing getting data from airports.json KLAX --> will correspond to lax data
  // create maintence due as well as it will just be 30 days from the current date
  // add fs to import the airports.json --> this shouldn't be too bad
  const data = require("./airports.json");

  console.log("Lmao found the issue");

  console.log(data[aircraftData.location]); // check to make sure we are able to fetch the data from json file
  const long = data[aircraftData.location].lon;
  const lat = data[aircraftData.location].lat;

  // calculate new date for maintence today + 30 days

  const maintenance_due = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // add 30 days to the current date

  const values = [
    newId,
    "available", // preset the status
    aircraftData.model,
    aircraftData.tail_number,
    curr_flight_hours,
    aircraftData.capacity,
    aircraftData.location,
    maintenance_due, // change this
    long, // Will be provided from airports.json
    lat, // Will be provided from airports.json
  ];

  try {
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Error creating new aircraft:", err);
    throw err;
  }
};

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  let response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: "",
  };

  const client = new Client(dbConfig);

  try {
    console.log("Attempting database connection...");
    await client.connect();
    console.log("Database connected successfully");

    const path = event.path;
    const method = event.httpMethod;
    console.log("Request path:", path, "Method:", method);

    let data;

    if (
      method === "GET" &&
      (path.endsWith("/table") || path.includes("/table/"))
    ) {
      console.log("Executing getAircraftData query...");
      data = await getAircraftData(client);
      console.log("Query completed, rows returned:", data.length);
    } else if (method === "GET" && path.endsWith("/map")) {
      console.log("getting data for the table");
      data = await getMapData(client); // pass in the database connecton
    } else if (method === "POST" && path.endsWith("/aircraft")) {
      console.log("Creating new aircraft");
      const aircraftData = JSON.parse(event.body);
      console.log(aircraftData);
      data = await createNewAircraft(client, aircraftData);
      console.log("Aircraft created:", data);
    } else {
      throw new Error("Invalid path or method");
    }

    response.body = JSON.stringify({
      success: true,
      data: data,
    });
  } catch (err) {
    console.error("Detailed error:", {
      message: err.message,
      stack: err.stack,
      code: err.code,
    });

    response.statusCode = 500;
    response.body = JSON.stringify({
      success: false,
      message: "Internal server error",
      error: err.message,
      details: err.code,
    });
  } finally {
    try {
      await client.end();
      console.log("Database connection closed");
    } catch (err) {
      console.error("Error closing database connection:", err);
    }
  }

  console.log("Returning response:", response);
  return response;
};
