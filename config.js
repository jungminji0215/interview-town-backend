import dotenv from "dotenv";

dotenv.config();

const required = (key, defaultValue = undefined) => {
  const value = process.env[key] || defaultValue;

  if (value === null) {
    throw new Error(`Key ${key} is undefined`);
  }

  return value;
};

export const config = {
  db: {
    host: required("DB_HOST"),
    user: required("DB_USER"),
    database: required("DB_DATABASE"),
    password: required("DB_PASSWORD"),
  },
  env: {
    nodeEnv: required("NODE_ENV"),
  },
};
