-- Create all content type tables

-- 1. Animalitos table
CREATE TABLE IF NOT EXISTS animalitos (
  id SERIAL PRIMARY KEY,
  number INTEGER NOT NULL UNIQUE CHECK (number >= 1 AND number <= 36),
  name VARCHAR(255) NOT NULL UNIQUE,
  emoji VARCHAR(10),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR(255)
);

-- 2. Lotteries table
CREATE TABLE IF NOT EXISTS lotteries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  min_bet_amount DECIMAL(10,2) DEFAULT 1.0,
  max_bet_amount DECIMAL(10,2) DEFAULT 1000.0,
  payout_multiplier DECIMAL(10,2) DEFAULT 70.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR(255)
);

-- 3. Animalitos Games table
CREATE TABLE IF NOT EXISTS animalitos_games (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  min_bet_amount DECIMAL(10,2) DEFAULT 1.0,
  max_bet_amount DECIMAL(10,2) DEFAULT 500.0,
  payout_multiplier DECIMAL(10,2) DEFAULT 28.0,
  scheduled_time TIME,
  close_minutes_before INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR(255)
);

-- 4. Sports table
CREATE TABLE IF NOT EXISTS sports (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR(255)
);

-- 5. Teams table
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(255),
  logo_url VARCHAR(255),
  sport_id INTEGER REFERENCES sports(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR(255)
);

-- 6. Matches table
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  sport_id INTEGER REFERENCES sports(id) ON DELETE SET NULL,
  home_team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  away_team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  start_time TIMESTAMP,
  status VARCHAR(50) DEFAULT 'scheduled',
  home_score INTEGER,
  away_score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR(255)
);

-- 7. Markets table
CREATE TABLE IF NOT EXISTS markets (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  market_type VARCHAR(50),
  selection VARCHAR(255),
  odds DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  result VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR(255)
);

-- 8. Animalitos Draws table
CREATE TABLE IF NOT EXISTS animalitos_draws (
  id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES animalitos_games(id) ON DELETE SET NULL,
  draw_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  winning_animal_number INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR(255)
);

-- 9. Lottery Draws table
CREATE TABLE IF NOT EXISTS lottery_draws (
  id SERIAL PRIMARY KEY,
  lottery_id INTEGER REFERENCES lotteries(id) ON DELETE SET NULL,
  draw_date DATE NOT NULL,
  draw_time TIME,
  status VARCHAR(50) DEFAULT 'open',
  close_minutes_before INTEGER DEFAULT 5,
  winning_number VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR(255)
);

-- 10. Animalitos Bets table
CREATE TABLE IF NOT EXISTS animalitos_bets (
  id SERIAL PRIMARY KEY,
  draw_id INTEGER REFERENCES animalitos_draws(id) ON DELETE SET NULL,
  animalito_id INTEGER REFERENCES animalitos(id) ON DELETE SET NULL,
  ticket_code VARCHAR(255) UNIQUE,
  bet_amount DECIMAL(10,2) NOT NULL,
  potential_win DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  user_name VARCHAR(255),
  user_phone VARCHAR(255),
  paid_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR(255)
);

-- 11. Lottery Bets table
CREATE TABLE IF NOT EXISTS lottery_bets (
  id SERIAL PRIMARY KEY,
  draw_id INTEGER REFERENCES lottery_draws(id) ON DELETE SET NULL,
  ticket_code VARCHAR(255) UNIQUE,
  bet_number VARCHAR(10) NOT NULL,
  bet_amount DECIMAL(10,2) NOT NULL,
  potential_win DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  user_name VARCHAR(255),
  user_phone VARCHAR(255),
  paid_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR(255)
);

-- 12. Parley Tickets table
CREATE TABLE IF NOT EXISTS parley_tickets (
  id SERIAL PRIMARY KEY,
  ticket_code VARCHAR(255) UNIQUE,
  total_bet_amount DECIMAL(10,2) NOT NULL,
  total_odds DECIMAL(10,2),
  potential_win DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  user_name VARCHAR(255),
  user_phone VARCHAR(255),
  paid_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR(255)
);

-- 13. Parley Legs table
CREATE TABLE IF NOT EXISTS parley_legs (
  id SERIAL PRIMARY KEY,
  parley_ticket_id INTEGER REFERENCES parley_tickets(id) ON DELETE CASCADE,
  market_id INTEGER REFERENCES markets(id) ON DELETE SET NULL,
  selected_odds DECIMAL(10,2),
  result VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR(255)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_animalitos_number ON animalitos(number);
CREATE INDEX IF NOT EXISTS idx_animalitos_draws_game_id ON animalitos_draws(game_id);
CREATE INDEX IF NOT EXISTS idx_animalitos_draws_draw_date ON animalitos_draws(draw_date);
CREATE INDEX IF NOT EXISTS idx_lottery_draws_lottery_id ON lottery_draws(lottery_id);
CREATE INDEX IF NOT EXISTS idx_lottery_draws_draw_date ON lottery_draws(draw_date);
CREATE INDEX IF NOT EXISTS idx_teams_sport_id ON teams(sport_id);
CREATE INDEX IF NOT EXISTS idx_matches_sport_id ON matches(sport_id);
CREATE INDEX IF NOT EXISTS idx_matches_home_team_id ON matches(home_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_away_team_id ON matches(away_team_id);
CREATE INDEX IF NOT EXISTS idx_markets_match_id ON markets(match_id);
CREATE INDEX IF NOT EXISTS idx_animalitos_bets_draw_id ON animalitos_bets(draw_id);
CREATE INDEX IF NOT EXISTS idx_animalitos_bets_ticket_code ON animalitos_bets(ticket_code);
CREATE INDEX IF NOT EXISTS idx_lottery_bets_draw_id ON lottery_bets(draw_id);
CREATE INDEX IF NOT EXISTS idx_lottery_bets_ticket_code ON lottery_bets(ticket_code);
CREATE INDEX IF NOT EXISTS idx_parley_legs_parley_ticket_id ON parley_legs(parley_ticket_id);
CREATE INDEX IF NOT EXISTS idx_parley_legs_market_id ON parley_legs(market_id);
