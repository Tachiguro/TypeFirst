import type { LanguageId } from '../catalog/types'

export type ExerciseCategory = 'sentences'

export interface Exercise {
  id: string
  language: LanguageId
  category: ExerciseCategory
  target: string
}

export const EXERCISES: readonly Exercise[] = [
  {
    id: 'de-sentence-001',
    language: 'de',
    category: 'sentences',
    target: 'Flinke Hände tippen klare Wörter.',
  },
  {
    id: 'en-sentence-001',
    language: 'en',
    category: 'sentences',
    target: 'Quick hands type clear words.',
  },
]

export const getExerciseForLanguage = (language: LanguageId) => {
  const exercise = EXERCISES.find((candidate) => candidate.language === language)

  if (!exercise) {
    throw new Error(`No exercise is available for language: ${language}`)
  }

  return exercise
}

export const getNextExercise = (currentId: string) => {
  const currentIndex = EXERCISES.findIndex((exercise) => exercise.id === currentId)
  return EXERCISES[(currentIndex + 1) % EXERCISES.length]
}
