import { create } from 'zustand';
import { User, Resource, Year } from '@/types';

interface AppState {
    currentUser: User | null;
    users: User[];
    resources: Resource[];
    years: Year[];

    // Actions
    login: (email: string, role: 'admin' | 'student') => void;
    logout: () => void;
    addResource: (resource: Resource) => void;
    approveStudent: (studentId: string, years: string[]) => void;
    getStudentResources: (studentId: string) => Resource[];
}

// Mock Data
const MOCK_YEARS: Year[] = [
    { id: '2025', name: '2025 A/L' },
    { id: '2026', name: '2026 A/L' },
    { id: '2027', name: '2027 A/L' },
];

const MOCK_RESOURCES: Resource[] = [
    { id: '1', title: 'Intro to Microeconomics', type: 'pdf', url: '#', yearId: '2025', isFree: true, createdAt: new Date().toISOString() },
    { id: '2', title: 'Demand and Supply', type: 'video', url: '#', yearId: '2025', isFree: false, createdAt: new Date().toISOString() },
    { id: '3', title: 'Market Structures', type: 'pdf', url: '#', yearId: '2026', isFree: false, createdAt: new Date().toISOString() },
];

const MOCK_USERS: User[] = [
    { id: 'admin', name: 'Mr. Teacher', email: 'teacher@econ.lk', role: 'admin' },
    { id: 'student1', name: 'Kamal Perera', email: 'kamal@student.lk', role: 'student', assignedYears: ['2025'] },
    { id: 'student2', name: 'Nimali Silva', email: 'nimali@student.lk', role: 'student', assignedYears: [] }, // Pending approval/assignment
];

export const useStore = create<AppState>((set, get) => ({
    currentUser: null,
    users: MOCK_USERS,
    resources: MOCK_RESOURCES,
    years: MOCK_YEARS,

    login: (email, role) => {
        const user = get().users.find(u => u.email === email && u.role === role);
        if (user) {
            set({ currentUser: user });
        } else {
            // Mock login for demo purposes if user doesn't exist in mock list
            const newUser: User = {
                id: Math.random().toString(36).substr(2, 9),
                name: 'Demo User',
                email,
                role,
                assignedYears: role === 'student' ? [] : undefined
            };
            set(state => ({
                currentUser: newUser,
                users: [...state.users, newUser]
            }));
        }
    },

    logout: () => set({ currentUser: null }),

    addResource: (resource) => set(state => ({
        resources: [resource, ...state.resources]
    })),

    approveStudent: (studentId, years) => set(state => ({
        users: state.users.map(u =>
            u.id === studentId ? { ...u, assignedYears: years } : u
        )
    })),

    getStudentResources: (studentId) => {
        const user = get().users.find(u => u.id === studentId);
        if (!user || user.role !== 'student' || !user.assignedYears) return [];

        // Return resources that match the student's assigned years OR are free
        return get().resources.filter(r =>
            user.assignedYears?.includes(r.yearId) || r.isFree
        );
    }
}));
