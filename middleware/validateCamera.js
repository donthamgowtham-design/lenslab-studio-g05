// middleware/validateCamera.js
// Member 4: Input Validation Middleware for Camera Endpoints

function validateCamera(req, res, next) {
    const { name, kind } = req.body;

    // Check if name is missing or empty
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
            error: "Validation failed: 'name' is required and must be a non-empty string."
        });
    }

    // Check if kind is missing or empty
    if (!kind || typeof kind !== 'string' || kind.trim() === '') {
        return res.status(400).json({
            error: "Validation failed: 'kind' is required and must be a non-empty string."
        });
    }

    // Normalize trimmed values
    req.body.name = name.trim();
    req.body.kind = kind.trim();

    next();
}

module.exports = { validateCamera };
