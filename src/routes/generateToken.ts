import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: number, tenantId: string) => {
  const accessToken = jwt.sign(
    {
      userId,
      tenantId,
    },
    process.env.SECRET_KEY as string,
    {
      expiresIn: "10m",
    }
  );

  return accessToken;
};

export const generateRefreshToken = (userId: number, tenantId: string) => {
  const refreshToken = jwt.sign(
    {
      userId,
      tenantId,
    },
    process.env.SECRET_KEY as string,
    {
      expiresIn: "7d",
    }
  );

  return refreshToken;
};
