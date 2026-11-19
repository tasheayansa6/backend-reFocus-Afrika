function isNonEmptyString(value, max = 255) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRegistration(req, res, next) {
  const {
    fullName,
    age,
    gender,
    region,
    phone,
    email,
    education,
    occupation,
    category,
    course,
    level,
    interests,
    careerGoal,
    mode,
    consent,
    password,
  } = req.body || {};

  const errors = [];
  const ageNum = Number(age);

  if (!isNonEmptyString(fullName, 150)) errors.push("fullName is required.");
  if (!Number.isInteger(ageNum) || ageNum < 16 || ageNum > 25) {
    errors.push("age must be a number between 16 and 25.");
  }
  if (!isNonEmptyString(gender, 40)) errors.push("gender is required.");
  if (!isNonEmptyString(region, 120)) errors.push("region is required.");
  if (!isNonEmptyString(phone, 40)) errors.push("phone is required.");
  if (!isNonEmptyString(email, 190) || !isValidEmail(String(email).trim())) {
    errors.push("A valid email is required.");
  }
  if (!isNonEmptyString(education, 120)) errors.push("education is required.");
  if (!isNonEmptyString(occupation, 120)) errors.push("occupation is required.");
  if (!isNonEmptyString(category, 120)) errors.push("category is required.");
  if (!isNonEmptyString(course, 180)) errors.push("course is required.");
  if (!isNonEmptyString(level, 80)) errors.push("level is required.");
  if (interests != null && typeof interests !== "string") errors.push("interests must be a string.");
  if (careerGoal != null && typeof careerGoal !== "string") errors.push("careerGoal must be a string.");
  if (!isNonEmptyString(mode, 80)) errors.push("mode is required.");
  if (consent !== true && consent !== 1 && consent !== "true") {
    errors.push("consent must be true.");
  }
  if (!isNonEmptyString(password, 100) || String(password).length < 6) {
    errors.push("password is required (min 6 characters).");
  }

  if (errors.length) {
    return res.status(400).json({
      ok: false,
      message: "Validation failed.",
      errors,
    });
  }

  req.registration = {
    fullName: String(fullName).trim(),
    age: ageNum,
    gender: String(gender).trim(),
    region: String(region).trim(),
    phone: String(phone).trim(),
    email: String(email).trim().toLowerCase(),
    education: String(education).trim(),
    occupation: String(occupation).trim(),
    category: String(category).trim(),
    course: String(course).trim(),
    level: String(level).trim(),
    interests: interests ? String(interests).trim() : null,
    careerGoal: careerGoal ? String(careerGoal).trim() : null,
    mode: String(mode).trim(),
    consent: 1,
    password: String(password),
  };

  return next();
}

module.exports = validateRegistration;
