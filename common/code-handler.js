const { cpp, node, python, java } = require('compile-run');

const languages = {
    'python': python,
    'c_cpp': cpp,
    'javascript': node,
    'java': java
};

function run(language, code, stdin) {
    return languages[language].runSource(code, { stdin: stdin });
}

module.exports = run;