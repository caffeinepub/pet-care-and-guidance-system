import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface VideoLink {
    id: VideoId;
    url: string;
    title: string;
    description: string;
    category: VideoCategory;
    uploadedBy: Principal;
}
export interface PetCategory {
    name: string;
    description: string;
    image?: ExternalBlob;
    videos: Array<YoutubeVideo>;
}
export type Timestamp = bigint;
export interface Favorite {
    name: string;
    videoId: VideoId;
}
export interface Breed {
    name: string;
    description: string;
    category: string;
    image?: ExternalBlob;
    videos: Array<YoutubeVideo>;
}
export interface Pet {
    id: PetId;
    age: bigint;
    weight?: bigint;
    vaccinations: Array<Vaccination>;
    name: string;
    petType: PetType;
    lastVaccinatedDate?: Timestamp;
    gender: Gender;
    breed?: string;
    photo?: ExternalBlob;
}
export type VideoCategory = {
    __kind__: "healthTopic";
    healthTopic: string;
} | {
    __kind__: "petType";
    petType: PetType;
} | {
    __kind__: "breed";
    breed: string;
};
export type PetId = bigint;
export type Gender = {
    __kind__: "other";
    other: string;
} | {
    __kind__: "female";
    female: null;
} | {
    __kind__: "male";
    male: null;
};
export type VideoId = bigint;
export interface Vaccination {
    name: string;
    completed: boolean;
    dueDate: Timestamp;
    reminderFrequency: VaccinationFrequency;
}
export interface YoutubeVideo {
    url: string;
    title: string;
}
export interface UserProfile {
    favorites: Array<Favorite>;
    name: string;
    pets: Array<Pet>;
    profilePhoto?: ExternalBlob;
    email: string;
}
export enum PetType {
    cat = "cat",
    dog = "dog"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VaccinationFrequency {
    everyYear = "everyYear",
    everyThreeYears = "everyThreeYears"
}
export interface backendInterface {
    addAdminVideoLink(video: VideoLink): Promise<VideoId>;
    addBreed(breed: Breed): Promise<void>;
    addFavorite(videoId: VideoId, name: string): Promise<void>;
    addPet(pet: Pet): Promise<PetId>;
    addPetCategory(category: PetCategory): Promise<void>;
    addVaccination(petId: PetId, name: string, dueDate: Timestamp, reminderFrequency: VaccinationFrequency): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllAdminVideoLinks(): Promise<Array<VideoLink>>;
    getAllBreeds(): Promise<Array<Breed>>;
    getAllFavoriteVideos(): Promise<Array<Favorite>>;
    getAllPetCategories(): Promise<Array<PetCategory>>;
    getBreedsByCategory(category: string): Promise<Array<Breed>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardInfo(): Promise<UserProfile>;
    getPet(petId: PetId): Promise<Pet>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVaccinationReminders(): Promise<Array<[string, Array<Vaccination>]>>;
    getVideosByCategory(category: VideoCategory): Promise<Array<VideoLink>>;
    isCallerAdmin(): Promise<boolean>;
    markVaccinationCompleted(petId: PetId, vaccinationName: string): Promise<void>;
    removeAdminVideoLink(videoId: VideoId): Promise<void>;
    removeBreed(name: string): Promise<void>;
    removeFavorite(videoId: VideoId): Promise<void>;
    removePet(petId: PetId): Promise<void>;
    removePetCategory(name: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitOnboardingPet(pet: Pet): Promise<PetId>;
    updateAdminVideoLink(videoId: VideoId, updatedVideo: VideoLink): Promise<void>;
    updateBreed(name: string, updatedBreed: Breed): Promise<void>;
    updatePet(petId: PetId, updatedPet: Pet): Promise<void>;
    updatePetCategory(name: string, updatedCategory: PetCategory): Promise<void>;
}
