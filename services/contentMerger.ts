
import { WorldContent } from './courses/types';

// Helper to safely parse resources
const parseResources = (resources: any) => {
    if (typeof resources === 'string') {
        try {
            return JSON.parse(resources);
        } catch {
            return [];
        }
    }
    return resources || [];
};

/**
 * Merges Database Module data into the Static WorldContent structure.
 * This allows Admin edits to override the hardcoded content while preserving
 * the visual layout and assets of the static files.
 */
export const mergeWorldContent = (
    staticContent: WorldContent | null,
    dbModule: any
): WorldContent | null => {
    if (!staticContent) return null;
    if (!dbModule) return staticContent;

    // Deep copy to avoid mutating original static file
    const merged = JSON.parse(JSON.stringify(staticContent));

    // 1. OVERRIDE WORLD META
    if (dbModule.title) {
        merged.title = dbModule.title;
        // Also update sub-titles if they exist in static content, 
        // strictly speaking DB title is the "Main Title"
    }
    if (dbModule.description) {
        merged.description = dbModule.description;
        // Some static content puts description in 'narrative.intro'
        // We might want to keep narrative.intro as is (voiceover script) 
        // and description as the text shown on screen.
    }

    // 2. OVERRIDE LESSONS (Sun, Moon, Thread)
    // We assume Order Index 0 = Sun, 1 = Moon, 2 = Thread
    if (dbModule.lessons && Array.isArray(dbModule.lessons)) {
        const sortedLessons = [...dbModule.lessons].sort((a, b) => a.order_index - b.order_index);

        // --- SUN MODULE (Lesson 0) ---
        if (sortedLessons[0] && merged.dualModules?.sunContent) {
            const sun = sortedLessons[0];
            merged.dualModules.sunContent.title = sun.title || merged.dualModules.sunContent.title;

            // Map Description to longText (HTML) vs technicalContent
            // If description is simple text, use technicalContent. If HTML, use longText.
            const desc = sun.description || '';
            const isHtml = /<[a-z][\s\S]*>/i.test(desc);

            if (isHtml) {
                merged.dualModules.sunContent.longText = desc;
                // Keep technicalContent as summary if needed, or clear it to force longText usage
            } else {
                merged.dualModules.sunContent.technicalContent = desc;
            }

            if (sun.video_url) merged.dualModules.sunContent.videoUrl = sun.video_url;

            // Resources
            const res = parseResources(sun.resources);
            if (res.length > 0) merged.dualModules.sunContent.downloads = res;
        }

        // --- MOON MODULE (Lesson 1) ---
        if (sortedLessons[1] && merged.dualModules?.moonContent) {
            const moon = sortedLessons[1];
            merged.dualModules.moonContent.title = moon.title || merged.dualModules.moonContent.title;

            const desc = moon.description || '';
            const isHtml = /<[a-z][\s\S]*>/i.test(desc);

            if (isHtml) {
                merged.dualModules.moonContent.longText = desc;
            } else {
                merged.dualModules.moonContent.psychologicalContent = desc;
            }

            if (moon.video_url) merged.dualModules.moonContent.videoUrl = moon.video_url;

            const res = parseResources(moon.resources);
            if (res.length > 0) merged.dualModules.moonContent.downloads = res;
        }

        // --- GOLDEN THREAD (Lesson 2) ---
        if (sortedLessons[2] && merged.dualModules?.goldenThread) {
            const thread = sortedLessons[2];
            merged.dualModules.goldenThread.title = thread.title || merged.dualModules.goldenThread.title;

            const desc = thread.description || '';
            // Thread usually has synthesisExercise or output
            merged.dualModules.goldenThread.synthesisExercise = desc;
            // Or longText if supported
            if (/<[a-z][\s\S]*>/i.test(desc)) {
                merged.dualModules.goldenThread.longText = desc;
            }

            if (thread.video_url) merged.dualModules.goldenThread.videoUrl = thread.video_url;

            const res = parseResources(thread.resources);
            if (res.length > 0) merged.dualModules.goldenThread.downloads = res;
        }

        // --- EXTRA MODULES (Lesson 3+) ---
        if (sortedLessons.length > 3) {
            merged.extraModules = [];
            for (let i = 3; i < sortedLessons.length; i++) {
                const extra = sortedLessons[i];
                merged.extraModules.push({
                    title: extra.title || `Lezione ${i + 1}`,
                    content: extra.description || '',
                    videoUrl: extra.video_url,
                    downloads: parseResources(extra.resources)
                });
            }
        }
    }

    return merged;
};
