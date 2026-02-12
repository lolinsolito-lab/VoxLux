import { supabase } from './supabase';

/**
 * Saves world (mastermind) completion to the database.
 * 
 * Uses the `course_progress` table with TEXT IDs:
 * - course_id: 'matrice-1' | 'matrice-2'
 * - mastermind_id: theme.id (e.g., 'mondo_1', 'pod_1')
 * - module_id: individual module IDs from the mastermind
 * 
 * Also updates `last_active_world` in localStorage for resume UX.
 */

interface SaveProgressParams {
    userId: string;
    courseId: string;         // 'matrice-1' | 'matrice-2'
    mastermindId: string;     // theme.id or mastermind.id
    worldIndex: number;       // 0-9
    moduleIds: string[];      // All module IDs in this world
}

export const saveWorldProgress = async ({
    userId,
    courseId,
    mastermindId,
    worldIndex,
    moduleIds
}: SaveProgressParams): Promise<{ success: boolean; error?: string }> => {
    try {
        const now = new Date().toISOString();

        // 1. Upsert each module as completed
        const rows = moduleIds.map(moduleId => ({
            user_id: userId,
            course_id: courseId,
            mastermind_id: mastermindId,
            module_id: moduleId,
            completed: true,
            completed_at: now,
        }));

        if (rows.length > 0) {
            const { error: progressError } = await supabase
                .from('course_progress')
                .upsert(rows, { onConflict: 'user_id,module_id' });

            if (progressError) {
                console.error('[saveWorldProgress] Error saving progress:', progressError);
                return { success: false, error: progressError.message };
            }
        }

        // 2. Save last active position for resume UX (localStorage)
        saveLastActive(courseId, worldIndex, mastermindId);

        console.log(`[saveWorldProgress] ✅ Saved: ${courseId} / world ${worldIndex + 1} (${moduleIds.length} modules)`);
        return { success: true };

    } catch (error: any) {
        console.error('[saveWorldProgress] Unexpected error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Records that the user started/entered a world (for "resume" UX).
 * Called when entering a world, even if not completing it.
 */
export const trackWorldEntry = (courseId: string, worldIndex: number, mastermindId: string) => {
    saveLastActive(courseId, worldIndex, mastermindId);
};

/**
 * Gets the last active world for a course (for "Riprendi" card).
 */
export interface LastActiveWorld {
    courseId: string;
    worldIndex: number;
    mastermindId: string;
    timestamp: string;
}

export const getLastActiveWorld = (courseId: string): LastActiveWorld | null => {
    try {
        const stored = localStorage.getItem(`voxlux_lastactive_${courseId}`);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

/**
 * Gets all last-active entries across all courses.
 */
export const getAllLastActive = (): LastActiveWorld[] => {
    const courseIds = ['matrice-1', 'matrice-2'];
    return courseIds
        .map(id => getLastActiveWorld(id))
        .filter((x): x is LastActiveWorld => x !== null);
};

// --- Internal helpers ---

const saveLastActive = (courseId: string, worldIndex: number, mastermindId: string) => {
    try {
        const data: LastActiveWorld = {
            courseId,
            worldIndex,
            mastermindId,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(`voxlux_lastactive_${courseId}`, JSON.stringify(data));
    } catch {
        // localStorage might be unavailable
    }
};
