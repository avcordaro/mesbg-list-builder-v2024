export type SharedStats = {
  new_users_last_7_days: string;
  active_users_last_7_days: string;
  rosters_created_last_7_days: string;
  active_games_last_7_days: string;
  games_last_7_days: string;
  total_rosters: string;
  total_games: string;
  total_users: string;
};

export type CachedStats = {
  timestamp: number;
  data: SharedStats;
};
