-- Insert sample aircraft data
INSERT INTO
    aircrafts (
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
    )
VALUES
    (
        'AC001',
        'Active',
        'Boeing 737-800',
        'N12345',
        12500,
        189,
        'LAX',
        '2025-04-15 10:00:00',
        33.9425,
        -118.4081
    ),
    (
        'AC002',
        'Maintenance',
        'Airbus A320',
        'N54321',
        15700,
        150,
        'SFO',
        '2025-03-01 14:30:00',
        37.6188,
        -122.3756
    ),
    (
        'AC003',
        'Active',
        'Boeing 787-9',
        'N78901',
        8900,
        290,
        'JFK',
        '2025-05-20 08:45:00',
        40.6413,
        -73.7781
    ),
    (
        'AC004',
        'Standby',
        'Airbus A321',
        'N45678',
        10200,
        200,
        'ORD',
        '2025-04-30 16:15:00',
        41.9742,
        -87.9073
    ),
    (
        'AC005',
        'Active',
        'Boeing 777-300',
        'N98765',
        22100,
        396,
        'DFW',
        '2025-03-25 11:30:00',
        32.8998,
        -97.0403
    ),
    (
        'AC006',
        'Active',
        'Airbus A350-900',
        'N24680',
        5600,
        325,
        'MIA',
        '2025-06-10 09:20:00',
        25.7959,
        -80.2870
    ),
    (
        'AC007',
        'Maintenance',
        'Boeing 737-900',
        'N13579',
        18400,
        178,
        'SEA',
        '2025-03-05 13:45:00',
        47.4502,
        -122.3088
    ),
    (
        'AC008',
        'Active',
        'Airbus A320neo',
        'N11223',
        3200,
        165,
        'ATL',
        '2025-05-01 15:30:00',
        33.6407,
        -84.4277
    ),
    (
        'AC009',
        'Standby',
        'Boeing 787-8',
        'N99887',
        9800,
        248,
        'DEN',
        '2025-04-12 12:00:00',
        39.8561,
        -104.6737
    ),
    (
        'AC010',
        'Active',
        'Airbus A321neo',
        'N44556',
        4100,
        220,
        'BOS',
        '2025-05-15 10:45:00',
        42.3656,
        -71.0096
    );
