// Extended Course Types with Quiz and Diploma support
export interface Module {
    id: string;
    title: string;
    description: string;
    output: string;
    type: 'audio' | 'video' | 'text';
    duration: string;
    // New Schema Fields (Optional for backward compatibility)
    order_index?: number;
    video_url?: string;
    resources?: any;
    lessons?: any[]; // For when Module represents a World (recursive/mixed usage)
}

export interface Mastermind {
    id: string;
    title: string;
    subtitle: string;
    description?: string;
    modules: Module[];
}

// DB-aligned Quiz Structure
export interface QuestionOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface QuizQuestion {
    id: string;
    text: string;
    options: QuestionOption[];
    explanation?: string; // Shown after answer
    points: number;
}

export interface Quiz {
    id: string;
    module_id: string;
    title: string;
    description?: string;
    questions: QuizQuestion[];
    passing_score: number; // Percentage
    created_at?: string;
}

// Legacy support if needed, but prefer strict typing
export interface CourseQuiz {
    courseId: string;
    passingScore: number;
    questions: any[];
}

export interface DiplomaSpec {
    name: string;
    visualDescription: string;
    technicalSpecs: {
        model3D: string;
        animations: string;
        audio: string;
        metadata: string;
        exports: string[];
    };
    personalization: {
        nominative: boolean;
        signature: boolean;
        security: string;
    };
}

export interface Course {
    id: string;
    title: string;
    description: string;
    masterminds: Mastermind[];
    quiz?: CourseQuiz; // Legacy
    // Valid DB Fields
    diploma_requirements?: {
        min_score_percent: number;
        required_quizzes: 'all' | string[];
        required_lessons: 'all' | string[];
        diploma_template_id: string;
    };
    diploma?: DiplomaSpec; // Frontend visual spec
}

// STORYTELLING WORLD CONTENT
// SHARED CONTENT INTERFACES
export interface ContentResource {
    label: string;
    url: string;
    type: 'pdf' | 'image' | 'link' | string;
}


export interface LessonSegment {
    title: string;
    content: string; // HTML allowed
    type: 'theory' | 'case-study' | 'workshop' | 'framework';
    image?: string; // Diagram/Chart URL/Path
}

export interface DualModuleContent {
    sunContent: {
        title: string;
        technicalContent: string;
        longText?: string; // Keep for backward compatibility
        segments?: LessonSegment[]; // NEW: University Structure
        microLesson: string;
        videoUrl?: string;
        featuredImage?: string;
        downloads?: ContentResource[];
    };
    moonContent: {
        title: string;
        psychologicalContent: string;
        longText?: string;
        segments?: LessonSegment[]; // NEW
        guidingQuestion: string;
        videoUrl?: string;
        featuredImage?: string;
        downloads?: ContentResource[];
    };
    goldenThread: {
        title?: string;
        synthesisExercise: string;
        longText?: string;
        segments?: LessonSegment[]; // NEW
        output: string;
        videoUrl?: string;
        featuredImage?: string;
        downloads?: ContentResource[];
    };
}

export interface WorldContent {
    id?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    narrative: {
        intro: string;
        outro: string;
    };
    dualModules: DualModuleContent;
    // New: Support for unlimited additional lessons (Lesson 4+)
    extraModules?: {
        title: string;
        content: string; // HTML/RichText
        videoUrl?: string;
        downloads?: ContentResource[];
    }[];
}
