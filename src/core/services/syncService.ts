import { supabase } from '../services/supabase';
import { goalRepository } from '../../features/goals/repositories/goalRepository';
import { habitRepository } from '../../features/habits/repositories/habitRepository';
// import { journalRepository } from '../../features/journal/repositories/journalRepository';
import { activityRepository } from '../repositories/activityRepository';

/**
 * SyncService handles the migration of local data to Supabase 
 * and ensures cloud data is synchronized locally.
 */
export const syncService = {
  async syncToCloud(userId: string) {
    console.log('Starting sync to cloud for user:', userId);
    
    // 1. Sync Goals
    const localGoals = goalRepository.getGoals();
    if (localGoals.length > 0) {
      const goalsToUpload = localGoals.map(g => ({
        ...g,
        user_id: userId,
        // Ensure id is UUID-like or let Supabase generate (but we want to keep consistency)
        // For simplicity in MVP, we might keep local IDs if they don't conflict
      }));
      // UPSERT goals
      const { error: gError } = await supabase.from('goals').upsert(goalsToUpload);
      if (gError) console.error('Error syncing goals:', gError);
    }

    // 2. Sync Habits
    const localHabits = habitRepository.getHabits();
    if (localHabits.length > 0) {
      const { error: hError } = await supabase.from('habits').upsert(localHabits.map(h => ({ ...h, user_id: userId })));
      if (hError) console.error('Error syncing habits:', hError);
    }

    // 3. Sync Logs
    const localLogs = habitRepository.getLogs();
    if (localLogs.length > 0) {
      const { error: lError } = await supabase.from('habit_logs').upsert(localLogs);
      if (lError) console.error('Error syncing logs:', lError);
    }

    // 4. Sync Journal (DISABLED - REPO MISSING)
    /*
    const localJournal = journalRepository.getEntries();
    if (localJournal.length > 0) {
      const { error: jError } = await supabase.from('journal_entries').upsert(localJournal.map(e => ({ ...e, user_id: userId })));
      if (jError) console.error('Error syncing journal:', jError);
    }
    */

    // 5. Sync Activities
    const localActivities = activityRepository.getActivities();
    if (localActivities.length > 0) {
      const { error: aError } = await supabase.from('activity_records').upsert(localActivities.map(a => ({ ...a, user_id: userId })));
      if (aError) console.error('Error syncing activities:', aError);
    }

    console.log('Sync to cloud completed.');
  },

  async syncFromCloud(userId: string) {
    // 1. Fetch from cloud and update local storage (Merge Strategy)
    // Fetch Goals
    const { data: cloudGoals } = await supabase.from('goals').select('*').eq('user_id', userId);
    if (cloudGoals) goalRepository.saveGoals(cloudGoals);

    // Fetch Habits
    const { data: cloudHabits } = await supabase.from('habits').select('*').eq('user_id', userId);
    if (cloudHabits) habitRepository.saveHabits(cloudHabits);

    // Fetch Logs
    // This is more complex since it's a junction, but let's assume habit_logs has user access via RLS
    // Actually habit_logs should be joined or filtered
    // For now, let's just fetch all logs related to user's habits
    const habitIds = cloudHabits?.map(h => h.id) || [];
    if (habitIds.length > 0) {
      const { data: cloudLogs } = await supabase.from('habit_logs').select('*').in('habit_id', habitIds);
      if (cloudLogs) habitRepository.saveLogs(cloudLogs);
    }

    // Fetch Journal
    /*
    const { data: cloudJournal } = await supabase.from('journal_entries').select('*').eq('user_id', userId);
    if (cloudJournal) journalRepository.saveEntries(cloudJournal);
    */

    // Fetch Activities
    const { data: cloudActivities } = await supabase.from('activity_records').select('*').eq('user_id', userId);
    if (cloudActivities) activityRepository.saveActivities(cloudActivities);
  }
};
