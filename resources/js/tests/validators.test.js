import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, profileSchema, academicRecordSchema, dreamJobSchema } from '../lib/validators';

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '123456' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'invalid', password: '123456' });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '12345' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('accepts matching passwords', () => {
    const result = registerSchema.safeParse({
      name: 'Jean', email: 'jean@example.com',
      password: '123456', password_confirmation: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-matching passwords', () => {
    const result = registerSchema.safeParse({
      name: 'Jean', email: 'jean@example.com',
      password: '123456', password_confirmation: '654321',
    });
    expect(result.success).toBe(false);
  });
});

describe('profileSchema', () => {
  it('accepts valid profile', () => {
    const result = profileSchema.safeParse({ age: 18, budget: 15000 });
    expect(result.success).toBe(true);
  });

  it('rejects age out of range', () => {
    const result = profileSchema.safeParse({ age: 0 });
    expect(result.success).toBe(false);
  });
});

describe('dreamJobSchema', () => {
  it('accepts valid dream job', () => {
    const result = dreamJobSchema.safeParse({ job_title: 'Data Scientist' });
    expect(result.success).toBe(true);
  });

  it('rejects empty job title', () => {
    const result = dreamJobSchema.safeParse({ job_title: '' });
    expect(result.success).toBe(false);
  });
});
