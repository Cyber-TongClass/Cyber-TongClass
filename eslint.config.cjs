const { FlatCompat } = require("@eslint/eslintrc")
const compat = new FlatCompat({})

module.exports = [
    // Load the existing legacy .eslintrc.json via compatibility layer
    ...compat.extends("./.eslintrc.json"),
]
