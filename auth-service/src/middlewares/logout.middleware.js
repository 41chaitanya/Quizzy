
export const logoutMiddleware = async (req, res, next) => {

    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    if (!token) return res.status(401).send("Unauthorized");

    req.token = token;

    next();
}