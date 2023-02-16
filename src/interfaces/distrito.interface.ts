export interface IDistrito {
    name: string;
    slug: string;
    generatedSlug(): string;
}