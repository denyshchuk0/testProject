export const REGISTRATION_CHANGE_FIRSTNAME_TEXT =
  "REGISTRATION_CHANGE_FIRSTNAME_TEXT";
export const REGISTRATION_CHANGE_LASTNAME_TEXT =
  "REGISTRATION_CHANGE_LASTNAME_TEXT";
export const REGISTRATION_CHANGE_AGE_TEXT = "REGISTRATION_CHANGE_AGE_TEXT";
export const REGISTRATION_CHANGE_EMAIL_TEXT = "REGISTRATION_CHANGE_EMAIL_TEXT";
export const REGISTRATION_CHANGE_PASSWORD_TEXT =
  "REGISTRATION_CHANGE_PASSWORD_TEXT";

export const setFirstNameText = (firstName) => ({
  type: REGISTRATION_CHANGE_FIRSTNAME_TEXT,
  payload: firstName,
});

export const setLastNameText = (lastName) => ({
  type: REGISTRATION_CHANGE_LASTNAME_TEXT,
  payload: lastName,
});

export const setAgeText = (age) => ({
  type: REGISTRATION_CHANGE_AGE_TEXT,
  payload: age,
});

export const setEmailText = (email) => ({
  type: REGISTRATION_CHANGE_EMAIL_TEXT,
  payload: email,
});

export const setPasswordText = (password) => ({
  type: REGISTRATION_CHANGE_PASSWORD_TEXT,
  payload: password,
});
