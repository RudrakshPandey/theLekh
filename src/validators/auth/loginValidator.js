import Joi from 'joi';

const LoginSchema = Joi.object({
  identifier: Joi.alternatives()
    .try(
      Joi.string()
        .email({ tlds: { allow: false } })
        .messages({ 'string.email': 'Must be a valid email' }),
      Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z0-9_.-]*$/) // optional: username allowed chars
        .messages({
          'string.min': 'Username must be at least 2 characters',
          'string.max': 'Username must be at most 50 characters',
          'string.pattern.base': 'Username contains invalid characters',
        })
    )
    .required()
    .messages({
      'any.required': 'Username or email is required',
      'alternatives.match': 'Must be a valid email or username',
    })
    .label('Username or Email'),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
    })
    .label('Password'),
});

export const validateLoginForm = (formData) => {
  const { error } = LoginSchema.validate(formData, { abortEarly: false });

  if (!error) return null;
  const errorMessages = {};
  error.details.forEach((detail) => {
    errorMessages[detail.path[0]] = detail.message;
  });
  return errorMessages;
};

export const ForgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ['com', 'net', 'org', 'email'] } })
    .required()
    .label('Email'),
});
