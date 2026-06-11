import { body } from 'express-validator';

export const createJobValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("requiredSkills")
    .isArray({ min: 1 })
    .withMessage("At least one skill is required"),

  body("requiredSkills.*")
    .trim()
    .notEmpty()
    .withMessage("Skill cannot be empty"),

  body("experienceRequired")
    .optional()
    .isString()
    .withMessage("Experience required must be a string"),

  body("location")
    .optional()
    .isString()
    .withMessage("Location must be a string"),

  body("employmentType")
    .optional()
    .isString()
    .withMessage("Employment type must be a string"),

];
