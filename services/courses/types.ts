// Extended Course Types with Quiz and Diploma support
export interface Module {
    id: string;
    title: string;
    description: string;
    output: string;
    type: 'audio' | 'video' | 'text';
    duration: string;
}

export interface Mastermind {
    id: string;
    title: string;
    subtitle: string;
    description?: string;
    modules: Module[];
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number; // index 0-3
    explanation?: string;
}

export interface CourseQuiz {
    courseId: string;
    passingScore: number; // percentage (e.g., 90)
    questions: QuizQuestion[];
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
    quiz?: CourseQuiz;
    diploma?: DiplomaSpec;
}

// STORYTELLING WORLD CONTENT
// SHARED CONTENT INTERFACES
export interface ContentResource {
    label: string;
    url: string;
    type: 'pdf' | 'image' | 'link';
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
}
