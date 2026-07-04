import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, '6 caractères minimum'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, '6 caractères minimum'),
  password_confirmation: z.string(),
}).refine(d => d.password === d.password_confirmation, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['password_confirmation'],
});

export const profileSchema = z.object({
  age: z.number({ invalid_type_error: 'Âge requis' }).min(1).max(120),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  budget: z.number().optional(),
  budget_currency: z.string().default('EUR'),
  bio: z.string().optional(),
  target_job_title: z.string().optional(),
  target_job_description: z.string().optional(),
});

export const academicRecordSchema = z.object({
  diploma: z.string().min(1, 'Diplôme requis'),
  field_of_study: z.string().optional(),
  institution: z.string().optional(),
  grade: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  disliked_subjects: z.array(z.string()).default([]),
});

export const dreamJobSchema = z.object({
  job_title: z.string().min(1, 'Titre du métier requis'),
  job_description: z.string().optional(),
});
