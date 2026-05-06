const { rateJoke } = require("./rateJoke.js");
const core = require("@actions/core");

async function run() {
    const joke = core.getInput("joke", { required: true });
    const token = core.getInput("token", { required: true });

    try {
        const rating = await rateJoke(joke, token);
        core.setOutput("result", JSON.stringify(rating));
    } catch (error) {
        core.setFailed(error.message);
    }
}

module.exports = { run };