-- Seed data for the database

-- 1. Insert 36 Animalitos
INSERT INTO animalitos (number, name, emoji) VALUES
(1, 'Carnero', '🐏'),
(2, 'Toro', '🐂'),
(3, 'Ciempiés', '🐛'),
(4, 'Alacrán', '🦂'),
(5, 'León', '🦁'),
(6, 'Rana', '🐸'),
(7, 'Perico', '🦜'),
(8, 'Ratón', '🐭'),
(9, 'Águila', '🦅'),
(10, 'Tigre', '🐯'),
(11, 'Gato', '🐱'),
(12, 'Caballo', '🐴'),
(13, 'Mono', '🐵'),
(14, 'Paloma', '🕊️'),
(15, 'Zorro', '🦊'),
(16, 'Oso', '🐻'),
(17, 'Pavo', '🦃'),
(18, 'Burro', '🫏'),
(19, 'Chivo', '🐐'),
(20, 'Cochino', '🐷'),
(21, 'Gallo', '🐓'),
(22, 'Camello', '🐫'),
(23, 'Cebra', '🦓'),
(24, 'Iguana', '🦎'),
(25, 'Gallina', '🐔'),
(26, 'Vaca', '🐄'),
(27, 'Perro', '🐕'),
(28, 'Zamuro', '🦅'),
(29, 'Elefante', '🐘'),
(30, 'Caimán', '🐊'),
(31, 'Lapa', '🐚'),
(32, 'Ardilla', '🐿️'),
(33, 'Pescado', '🐟'),
(34, 'Venado', '🦌'),
(35, 'Jirafa', '🦒'),
(36, 'Culebra', '🐍')
ON CONFLICT (number) DO NOTHING;

-- 2. Insert Lotteries
INSERT INTO lotteries (name, description, is_active, min_bet_amount, max_bet_amount, payout_multiplier) VALUES
('Zulia', 'Lotería tradicional del estado Zulia', true, 1.0, 500.0, 70.0),
('Triple Zulia', 'Triple sorteo diario del Zulia', true, 0.5, 300.0, 65.0),
('Caracas', 'Lotería de la capital', true, 1.0, 1000.0, 75.0),
('Táchira', 'Lotería del estado Táchira', true, 0.5, 400.0, 70.0)
ON CONFLICT (name) DO NOTHING;

-- 3. Insert Animalitos Games
INSERT INTO animalitos_games (name, description, is_active, min_bet_amount, max_bet_amount, payout_multiplier, scheduled_time, close_minutes_before) VALUES
('Lotto Activo', 'Sorteo de animalitos más popular de Venezuela', true, 1.0, 500.0, 28.0, '13:00:00', 5),
('La Granjita', 'Sorteo de animalitos nocturno', true, 0.5, 300.0, 25.0, '19:00:00', 5),
('Animalitos Zulia', 'Sorteo regional del Zulia', true, 1.0, 400.0, 30.0, '16:00:00', 5)
ON CONFLICT (name) DO NOTHING;

-- 4. Insert Sports
INSERT INTO sports (name, is_active) VALUES
('Fútbol', true),
('Béisbol', true),
('Baloncesto', true),
('Tenis', true)
ON CONFLICT (name) DO NOTHING;

-- 5. Insert Teams (using sport IDs from the inserted sports)
INSERT INTO teams (name, sport_id, country)
SELECT 'Real Madrid', id, 'España' FROM sports WHERE name = 'Fútbol'
ON CONFLICT DO NOTHING;

INSERT INTO teams (name, sport_id, country)
SELECT 'Barcelona', id, 'España' FROM sports WHERE name = 'Fútbol'
ON CONFLICT DO NOTHING;

INSERT INTO teams (name, sport_id, country)
SELECT 'Manchester United', id, 'Inglaterra' FROM sports WHERE name = 'Fútbol'
ON CONFLICT DO NOTHING;

INSERT INTO teams (name, sport_id, country)
SELECT 'Liverpool', id, 'Inglaterra' FROM sports WHERE name = 'Fútbol'
ON CONFLICT DO NOTHING;

INSERT INTO teams (name, sport_id, country)
SELECT 'Bayern Munich', id, 'Alemania' FROM sports WHERE name = 'Fútbol'
ON CONFLICT DO NOTHING;

INSERT INTO teams (name, sport_id, country)
SELECT 'PSG', id, 'Francia' FROM sports WHERE name = 'Fútbol'
ON CONFLICT DO NOTHING;

-- 6. Insert Animalitos Draws for today
INSERT INTO animalitos_draws (game_id, draw_date, status)
SELECT id, CURRENT_DATE, 'open' FROM animalitos_games
ON CONFLICT DO NOTHING;

-- 7. Insert Lottery Draws for today
INSERT INTO lottery_draws (lottery_id, draw_date, draw_time, status, close_minutes_before)
SELECT id, CURRENT_DATE, '14:00:00', 'open', 5 FROM lotteries
ON CONFLICT DO NOTHING;

-- 8. Insert Matches for tomorrow
WITH futbol AS (SELECT id FROM sports WHERE name = 'Fútbol'),
     real_madrid AS (SELECT id FROM teams WHERE name = 'Real Madrid' LIMIT 1),
     barcelona AS (SELECT id FROM teams WHERE name = 'Barcelona' LIMIT 1),
     man_united AS (SELECT id FROM teams WHERE name = 'Manchester United' LIMIT 1),
     liverpool AS (SELECT id FROM teams WHERE name = 'Liverpool' LIMIT 1)
INSERT INTO matches (sport_id, home_team_id, away_team_id, start_time, status)
VALUES
((SELECT id FROM futbol), (SELECT id FROM real_madrid), (SELECT id FROM barcelona), (CURRENT_DATE + INTERVAL '1 day') + TIME '18:00:00', 'scheduled'),
((SELECT id FROM futbol), (SELECT id FROM man_united), (SELECT id FROM liverpool), (CURRENT_DATE + INTERVAL '1 day') + TIME '20:00:00', 'scheduled');

-- 9. Insert Markets for the matches
WITH match1 AS (
  SELECT m.id FROM matches m
  JOIN teams ht ON m.home_team_id = ht.id
  WHERE ht.name = 'Real Madrid'
  LIMIT 1
),
match2 AS (
  SELECT m.id FROM matches m
  JOIN teams ht ON m.home_team_id = ht.id
  WHERE ht.name = 'Manchester United'
  LIMIT 1
)
INSERT INTO markets (match_id, market_type, selection, odds, is_active)
VALUES
-- Match 1 markets
((SELECT id FROM match1), '1X2', 'Local', 2.10, true),
((SELECT id FROM match1), '1X2', 'Empate', 3.20, true),
((SELECT id FROM match1), '1X2', 'Visitante', 3.50, true),
-- Match 2 markets
((SELECT id FROM match2), '1X2', 'Local', 2.10, true),
((SELECT id FROM match2), '1X2', 'Empate', 3.20, true),
((SELECT id FROM match2), '1X2', 'Visitante', 3.50, true);

-- Print summary
SELECT '✅ Seed data loaded successfully!' AS message;
SELECT COUNT(*) AS animalitos_count FROM animalitos;
SELECT COUNT(*) AS lotteries_count FROM lotteries;
SELECT COUNT(*) AS games_count FROM animalitos_games;
SELECT COUNT(*) AS sports_count FROM sports;
SELECT COUNT(*) AS teams_count FROM teams;
SELECT COUNT(*) AS draws_count FROM animalitos_draws;
SELECT COUNT(*) AS lottery_draws_count FROM lottery_draws;
SELECT COUNT(*) AS matches_count FROM matches;
SELECT COUNT(*) AS markets_count FROM markets;
