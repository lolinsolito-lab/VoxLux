import { supabase } from './supabase';
import { Quiz } from './courses/types';

export const quizService = {
    // GET Quiz for a specific Module
    getByModuleId: async (moduleId: string): Promise<Quiz | null> => {
        const { data, error } = await supabase
            .from('quizzes')
            .select('*')
            .eq('module_id', moduleId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // No quiz found
            console.error('Error fetching quiz:', error);
            throw error;
        }
        return data;
    },

    // SAVE (Upsert) Quiz
    saveQuiz: async (quiz: Partial<Quiz>): Promise<Quiz> => {
        // Remove 'id' if it's new/empty to let DB generate it, or handle upsert logic
        const { data, error } = await supabase
            .from('quizzes')
            .upsert(quiz, { onConflict: 'module_id' }) // Ensure 1 quiz per module
            .select()
            .single();

        if (error) {
            console.error('Error saving quiz:', error);
            throw error;
        }
        return data;
    },

    // DELETE Quiz
    deleteQuiz: async (quizId: string) => {
        const { error } = await supabase
            .from('quizzes')
            .delete()
            .eq('id', quizId);

        if (error) throw error;
    }
};
