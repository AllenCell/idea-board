import { describe, it, expect } from 'vitest';
import { resolveSlug, resolveSoftwareTools } from '../gatsby-resolver-utils';
import { DATASET_PATH, SOFTWARE_PATH } from '../constants';

describe('resolveSlug', () => {
    it('should return null when id is falsy', () => {
        expect(resolveSlug(null, 'software')).toBe(null);
        expect(resolveSlug(undefined, 'software')).toBe(null);
        expect(resolveSlug('', 'software')).toBe(null);
    });

    it('should build a slug from id and directory', () => {
        expect(resolveSlug("released-emt-dataset", DATASET_PATH)).toBe(
            "/dataset/released-emt-dataset/"
        );
    });

    it('should slugify the id to lowercase', () => {
        expect(resolveSlug("UPPERCASE", DATASET_PATH)).toBe(
            "/dataset/uppercase/"
        );
    });

    it('should handle special characters in id', () => {
        expect(resolveSlug("Tool & Library", SOFTWARE_PATH)).toBe(
            "/software/tool-and-library/"
        );
        expect(resolveSlug("Some/Path/Name", SOFTWARE_PATH)).toBe(
            "/software/somepathname/"
        );
    });

    it('should handle ids with leading/trailing spaces', () => {
        expect(resolveSlug('  trimmed  ', 'software')).toBe('/software/trimmed/');
    });
});

describe('resolveSoftwareTools', () => {
    it('should return empty array for non-array inputs', () => {
        expect(resolveSoftwareTools(null)).toEqual([]);
        expect(resolveSoftwareTools(undefined)).toEqual([]);
        expect(resolveSoftwareTools('string')).toEqual([]);
        expect(resolveSoftwareTools({})).toEqual([]);
        expect(resolveSoftwareTools(123)).toEqual([]);
    });

    it('should return empty array for empty array', () => {
        expect(resolveSoftwareTools([])).toEqual([]);
    });

    it('should filter out invalid items', () => {
        const input = [null, undefined, 'string', {}, { other: 'prop' }];
        expect(resolveSoftwareTools(input)).toEqual([]);
    });

    it('should transform valid items with softwareTool', () => {
        const input = [{ softwareTool: 'Simularium' }];
        expect(resolveSoftwareTools(input)).toEqual([
            {
                softwareTool: '/software/simularium/',
                customDescription: null,
            },
        ]);
    });

    it('should preserve customDescription when provided', () => {
        const input = [
            {
                softwareTool: 'Simularium',
                customDescription: 'Custom description here',
            },
        ];
        expect(resolveSoftwareTools(input)).toEqual([
            {
                softwareTool: '/software/simularium/',
                customDescription: 'Custom description here',
            },
        ]);
    });

    it('should return null for empty customDescription', () => {
        const input = [{ softwareTool: 'Simularium', customDescription: '' }];
        expect(resolveSoftwareTools(input)).toEqual([
            {
                softwareTool: '/software/simularium/',
                customDescription: null,
            },
        ]);
    });

    it('should handle mixed valid and invalid items', () => {
        const input = [
            null,
            { softwareTool: 'Simularium' },
            { other: 'invalid' },
            { softwareTool: 'TFE', customDescription: 'Time explorer' },
        ];
        expect(resolveSoftwareTools(input)).toEqual([
            {
                softwareTool: '/software/simularium/',
                customDescription: null,
            },
            {
                softwareTool: '/software/tfe/',
                customDescription: 'Time explorer',
            },
        ]);
    });
});